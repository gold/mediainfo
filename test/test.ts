// run this test suite with permissions
//
//  $ deno test -A

import { assertEquals, assertNotEquals } from 'https://deno.land/std@0.85.0/testing/asserts.ts';
import { mediainfo } from '../mod.ts';

const __dirname = new URL('.', import.meta.url).pathname;
const MEDIA_FILE_DIR = `${__dirname}sampleMedia`;

Deno.test({
  name: 'Audio File: extract Album and Performer',
  fn: async () => {
    const filename = `${MEDIA_FILE_DIR}/LinusSpeaks.m4a`;

    const result = await mediainfo.get(filename);

    const { Album, Performer } = result.info[0];
    assertEquals(Album, 'Best of Linus');
    assertEquals(Performer, 'Linus Torvalds');
  },

  // Deactivate open resource checking.
  //
  // This avoids resource leaking error from Deno's internal architecture.
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'Image File: extract Compression_Mode and Height',
  fn: async () => {
    const filename = `${MEDIA_FILE_DIR}/ten_node_regrets.jpg`;
    const result = await mediainfo.get(filename);

    const { Compression_Mode, Height } = result.info[1];
    assertEquals(Compression_Mode, 'Lossy');
    assertEquals(Height, '250');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'Image File: get XML output format',
  fn: async () => {
    const filename = `${MEDIA_FILE_DIR}/ten_node_regrets.jpg`;
    const result = await mediainfo.get(filename, '--Output=XML');
    const xml = result.info;
    assertEquals(xml.startsWith('<?xml'), true);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'Image File: filename has spaces',
  fn: async () => {
    const filename = `${MEDIA_FILE_DIR}/ten node regrets.jpg`;
    const result = await mediainfo.get(filename);
    const { Compression_Mode, Height } = result.info[1];
    assertEquals(Compression_Mode, 'Lossy');
    assertEquals(Height, '250');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'Image File: file not found - exitCode: 0',
  fn: async () => {
    const filename = `${MEDIA_FILE_DIR}/thisFi|eD0esNot3xist.tif`;
    const result = await mediainfo.get(filename);
    assertNotEquals(result.exitCode, 0);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
