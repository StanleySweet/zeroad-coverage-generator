import { promises as fs } from "fs";
import { join } from "path";

async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = join(src, entry.name);
        let destPath = join(dest, entry.name);

        entry.isDirectory() ?
            await copyDir(srcPath, destPath) :
            await fs.copyFile(srcPath, destPath);
    }
}

const mods = ["mod", "public"];
const zeroadSourceLocation = "/mnt/c/Dev/Perso/0ad-svn/binaries/data/mods";
const subpaths = [
    "maps/random/heightmap",
    "maps/random/rmbiome",
    "maps/random/rmgen",
    "maps/random/rmgen-common",
    "maps/random/rmgen2",
    "maps/random/tests",
    "globalscripts",
    "simulation/ai",
    "simulation/components",
    "simulation/data",
    "simulation/helpers"
]

await fs.rm("globalscripts", { recursive: true, force: true });
await fs.rm("simulation", { recursive: true, force: true });
await fs.rm("maps", { recursive: true, force: true });
await fs.rm("coverage", { recursive: true, force: true });
await fs.rm(".nyc_output", { recursive: true, force: true });

for (const mod of mods) {
    for (const subpath of subpaths) {
        try {
            await copyDir(zeroadSourceLocation + "/" + mod + "/" + subpath, subpath);
        } catch (e) {

        }
    }
}
