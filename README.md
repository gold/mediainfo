# mediainfo

## Introduction

mediainfo is a wrapper for the command line utility `mediainfo` for reading information from audio/video files. Image files are also supported.

## Requirement

You must have the `mediainfo` command line utility installed on your system. Following is for Debian-based systems:

```bash
$ sudo apt install mediainfo
```

## Documentation

The original binary program's [docs](https://manpages.ubuntu.com/manpages/focal/man1/mediainfo.1.html) provide usage details.

Unlike the original program, this Deno module sets the default output to be
JSON.

Therefore, if you omit the `--Output=<format>` option, the output will be JSON.
However, you can override the format with either, HTML, XML, or TEXT

The syntax varies somewhat when used with this Deno module. The following
examples will illustrate.

## Examples

`my-deno-script.ts`
```javascript
import { mediainfo } from 'https://deno.land/x/mediainfo/mod.ts';

// These items will be sent to the mediainfo program as command line arguments.
const args = ['audio-file.mp3']

// the result is an object containing two top level keys:
//
//  info: the string, either JSON or plain text from the mediainfo command
//  exitCode: either 0 or 1, mirroring the behavior of the mediainfo command
const result = await mediainfo.get(...args);

// OR
const anotherResult = await mediainfo.get('audio-file.mp3', '--Output=XML');

// OR
const yetAnotherResult = await mediainfo.get('--Version');

// print out the command's output
console.info(result.info);

// Exit this script with the same code that the mediainfo command used to exit.
// Of course, you can do whatever you want, based on this information.
Deno.exit(result.exitCode);
```

## Default and Raw Results

The get() method returns a simplified default JSON object.

Some meta data keys omitted in this example.

### get() results:
```json
{
  "exitCode": 0,
  "info": [
    {
      "@type": "General",
      AudioCount: "1",
      FileExtension: "m4a",
      Format: "MPEG-4",
      Album: "Best of Linus",
      Track: "Linus pronounces stuff",
      Track_Position: "1",
      Performer: "Linus Torvalds",
      Format_Profile: "Apple audio with iTunes info",
      CodecID: "M4A ",
      CodecID_Compatible: "mp42/mp41/isom/iso2",
      FileSize: "358116",
      Duration: "19.737",
    },
    {
      "@type": "Audio",
      StreamOrder: "0",
      ID: "1",
      Format: "AAC",
      Format_AdditionalFeatures: "LC",
      CodecID: "mp4a-40-2",
      Duration: "19.737",
      BitRate_Mode: "VBR",
      BitRate: "125588",
      Channels: "2",
      ChannelPositions: "Front: L R",
    }
  ]
}
```

The getRaw() method contains the same data in a more comprehensive and nested message shape:


```ts
{
  "exitCode": number,
  "info": object {
    "media": object {
      "@ref": string,
      "track": Array<object>
    }
  }
}
```

The input media file's meta data is referenced by the "track" key. "@ref" is the
input file name.

## Contribute

Merely by using this module, you will contribute to your own productivity.

Have fun!

Gerry Gold, 2021
