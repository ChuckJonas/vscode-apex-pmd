import * as fs from 'fs';
import * as path from 'path';

const TestUtils = {
    /**
     * Recursively copies a directory.
     * Creates the destination directory, if it doesn't exist yet.
     *
     * @param source source path
     * @param destination destination path
     */
    copyDirectory: function(source : string, destination : string) {
      if (fs.existsSync(destination)) {
        throw new Error(`Destination directory (or file) ${destination} already exists, won't copy!`);
      }
      const stat = fs.statSync(source);
      if (!stat.isDirectory()) {
        throw new Error(`Source path ${source} is not a directory. Won't copy!`);
      }

      fs.mkdirSync(destination);
      for (const file of fs.readdirSync(source)) {
        const originalFilePath = path.join(source, file);
        const targetFilePath = path.join(destination, file);
        const stat = fs.statSync(originalFilePath);
        if (stat.isFile()) {
          fs.copyFileSync(originalFilePath, targetFilePath);
        } else if (stat.isDirectory()) {
          TestUtils.copyDirectory(originalFilePath, targetFilePath);
        }
      }
    },

    /**
     * Recursively deletes a directory, if it exists.
     *
     * @param dir path to delete
     */
    deleteDirectory: function(dir : string) {
      if (!fs.existsSync(dir)) {
        return;
      }
      const stat = fs.statSync(dir);
      if (!stat.isDirectory()) {
        throw new Error(`Path ${dir} is not a directory. Won't delete!`);
      }

      for (const file of fs.readdirSync(dir)) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          fs.unlinkSync(filePath);
        } else if (stat.isDirectory()) {
          TestUtils.deleteDirectory(filePath);
        }
      }
      fs.rmdirSync(dir);
    }
};

export { TestUtils };
