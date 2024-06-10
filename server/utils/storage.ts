import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";

export const fsStorage = createStorage({
  driver: fsDriver({ base: './images' }),
});