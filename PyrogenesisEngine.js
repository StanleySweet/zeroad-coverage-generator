import fs from 'fs';
import vm from 'vm';
export class PyrogenesisEngine {
    constructor() {
        this.Context = undefined;
    }

    GlobalEval(filePath) {
        let fileText = "";
        try {
            fileText = fs.readFileSync(filePath, 'utf8');
        } catch (e) {
        }

        vm.runInContext(fileText, this.Context, { "filename": filePath });
    }

    SerializationRoundTrip(param) {
        // ToDo:
        return param;
    }

    LoadComponentScript(file) {
        this.GlobalEval("simulation/components/" + file);
    }

    LoadHelperScript(file) {
        this.GlobalEval("simulation/helpers/" + file);
    }

    LoadLibrary(folder) {
        this.IncludeModule("maps/random/" + folder)
    }

    ProfileStart(name)
    {

    }

    ProfileStop()
    {

    }

    /**
     *
     */
    ListDirectoryFiles(path, filterStr, recurse) {
        return fs.readdirSync(path).filter((a) => a.endsWith(filterStr.replace("*", ""))).map(a => path + "/" + a);
    }

    RegisterComponentType(iid, name, ctor) {
        this.Context.RegisterComponentType(iid,name,ctor);
    };

    RegisterSystemComponentType(iid, name, ctor) {
        this.Context.RegisterSystemComponentType(iid,name,ctor);
    };

    RegisterInterface(name) {
        this.Context.RegisterInterface(name);
    };

    RegisterMessageType(name) {
        this.Context.RegisterMessageType(name);
    };

    RegisterGlobal(name, value) {
        this.Context.RegisterGlobal(name,value);
    };

    QueryInterface(ent, iid) {
        if (this.Context.Components[ent] && this.Context.Components[ent][iid])
            return this.Context.Components[ent][iid];
        return null;
    };

    DestroyEntity(ent) {
        for (let cid in this.Context.Components[ent]) {
            let cmp = this.Context.Components[ent][cid];
            if (cmp && cmp.Deinit)
                cmp.Deinit();
        }

        delete this.Context.Components[ent];

        // TODO: should send Destroy message
    };

    PostMessage(ent, iid, message) {
        // TODO: make this send a message if necessary
    };


    BroadcastMessage(iid, message) {
        // TODO: make this send a message if necessary
    };

    ReadJSONFile(filename) {
        try {
            return JSON.parse(fs.readFileSync(filename, 'utf8'));
        } catch (e) {
            return {}
        }
    }

    /**
     *
     * @param moduleName
     */
    IncludeModule(moduleName) {
        const files = this.ListDirectoryFiles(moduleName, "*.js", true).filter(a => a.indexOf("test_") === -1);
        files.sort();
        for (const file of files) {
            this.GlobalEval(file);
        }
    }

    TestModule(moduleName, contextFactory) {
        const files = this.ListDirectoryFiles(moduleName, "*.js", true);
        files.sort();
        for (const file of files.filter(a => a.indexOf("test_") !== -1)) {
            try{
                QUnit.module(file);
                this.Context = contextFactory(this);
                vm.createContext(this.Context);
                this.IncludeModule("globalscripts");
                this.GlobalEval(file);
                this.ListDirectoryFiles = (path, filterStr, recurse) => fs.readdirSync(path).filter((a) => a.endsWith(filterStr.replace("*", ""))).map(a => path + "/" + a);
                this.ReadJSONFile = (filename)  => {
                    try {
                        return JSON.parse(fs.readFileSync(filename, 'utf8'));
                    } catch (e) {
                        return {}
                    }
                };
            }
            catch(e)
            {
                console.log(e)
            }
            // Indirect call to eval to force things in the global scope.
        }
    }
}
