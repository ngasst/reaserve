import * as Path from 'path';
import { readdir, writeFile } from 'fs-extra';


export function exportPolicies(folderPath: string) {
    const path: string = Path.resolve(folderPath);
    getFiles(path)
    .then((files: string[]) => {
        return getDeclaration(files);
    })
    .then((declarations: string) => {
        return writeIndex(path, declarations);
    })
    .then(() => {
        console.log('Done!');
    })
    .catch(err => console.log(err));
}

function writeIndex(path: string, declarations: string): Promise<any> {
    return new Promise((resolve, reject) => {
        let p: string = Path.join(path, 'index.ts');
        writeFile(p, declarations, (err) => {
            if(err) reject(err);
            resolve();
        });
    });
}

function getDeclaration(files: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        let imports = files
            .filter(f => f.indexOf('index') === -1)
            .map(f => f.slice(0, f.length - 3))
            .map(f => `import { policies as ${f} } from './${f}';\r\n`)
            .reduce((acc, val) => acc.concat(val), `import { Policy } from '../src/policy';\r\n`);
        let exported = files
            .filter(f => f.indexOf('index') === -1)
            .map(f => f.slice(0, f.length - 3));
        let exdecl: string = `export const policies: Policy[] = [].concat(...${exported.toString()})`;
        let declarations = imports.concat(`\r\n`).concat(exdecl);
        resolve(declarations);
    });
}

function getFiles(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        readdir(path, (err, files: string[]) => {
            if (err) reject(err);
            resolve(files);
        });
    });
}
