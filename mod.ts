// Copyright 2021-Eternity Channelping. All rights reserved. MIT License.

// This is a wrapper for the CLI utility mediainfo.

const MEDIA_INFO_CMD = 'mediainfo';

// HTML and XML are other available formats. Although mediainfo documentation
// does not include JSON as one of the available output formats, it's available.
const DEFAULT_OUTPUT_FORMAT = '--Output=JSON';
const OUTPUT_FORMAT_RX = /^--Output=\w+$/;

class MediaInfo {

  // Unlike mediainfo behavior, our wrapper has JSON output as the default.
  static setOutputFormat(params: Array<string>) {
    let outputOptionFound = false;
    for (const item of params) {
      if (OUTPUT_FORMAT_RX.test(item)) {
        outputOptionFound = true;
        break;
      }
    }

    if (!outputOptionFound) {
      params.push(DEFAULT_OUTPUT_FORMAT);
    }

    return params;
  }

  // params represents a list of strings.
  //
  // Order is not important.
  //
  // They are passed to the 'mediainfo' command and parsed there,
  static async get(...params: Array<string>) {
    const result = { exitCode: 0, info: {} };

    const options = MediaInfo.setOutputFormat(params) ;

    const cmd = Deno.run({
      cmd:[MEDIA_INFO_CMD, ...options],
      stdin: 'piped', stdout: 'piped', stderr: 'piped'
    });

    const { code } = await cmd.status();
    result.exitCode = code;

    const rawOutput = await cmd.output();
    const outputString = new TextDecoder().decode(rawOutput);

    try {
      result.info = JSON.parse(outputString);
    } catch (jsonParseError) {
      result.info = outputString.replace(/\n$/, '');
    }

    return result;
  }

  static async isMediaInfoCommandExist() {
    const cmd = Deno.run({
      cmd:['bash', 'which', MEDIA_INFO_CMD],
      stdin: 'piped', stdout: 'piped', stderr: 'piped'
    });
    try {
      const { code } = await cmd.status();
      cmd.close();
      return code === 0;
    } catch (e) {
      console.info('cmd.status() error:', e);
      Deno.exit(1);
    }
  }
} // end class

// Make sure mediainfo is available on the system
MediaInfo.isMediaInfoCommandExist().then((cmdExists) => {
  if (!cmdExists) {
    console.error(`"${MEDIA_INFO_CMD}" command not found.`);
    Deno.exit(1);
  }
});

export { MediaInfo as mediainfo };
