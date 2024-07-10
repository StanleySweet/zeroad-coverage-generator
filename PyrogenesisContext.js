import { QUnit } from 'qunit'
import { Spy } from './Spy.js'
import toSource from 'tosource';

function deepFreeze(object) {
    if (object) {
        var property, propertyKey;
        object = Object.freeze(object);
        for (propertyKey in object) {
            if (object.hasOwnProperty(propertyKey)) {
                property = object[propertyKey];
                if (
                    typeof property !== 'object' ||
                    !(property instanceof Object) ||
                    Object.isFrozen(property)
                ) {
                    continue;
                }
                deepFreeze(property);
            }
        }
    }
    return object;
}

export class PyrogenesisContext {
    constructor(engine) {
        this.NewIID = 1000;
        this.NewMTID = 1000;
        this.deepfreeze = deepFreeze;
        this.warn = console.warn;
        this.Engine = engine;
        this.log = console.log;
        this.ComponentTypes = {};
        this.Components = {};
        this.error = console.error;
        this.uneval = (a => toSource(a));
        this.clone = (a) => structuredClone(a);
        this.Spy = Spy;
        this.global = this;

        const getLine = () => {
            const pathDetail = (new Error()).stack.split("\n")[3].split(":");
            return pathDetail[pathDetail.length - 2];
        }
        this.TS_ASSERT_EQUALS = (a, b) => {
            QUnit.test('TS_ASSERT_EQUALS:' + getLine(), function (assert) {
                assert.equal(a, b);
            });
        };
        this.TS_ASSERT_UNEVAL_EQUALS = (a, b) => {
            QUnit.test('TS_ASSERT_UNEVAL_EQUALS:' + getLine(), function (assert) {
                assert.ok(toSource(a), toSource(b));
            });
        };
        this.TS_ASSERT = (a) => {
            QUnit.test('TS_ASSERT:' + getLine(), function (assert) {
                assert.ok(a);
            });
        };
        this.TS_ASSERT_GREATER_EQUAL = (a, b) => {
            QUnit.test('TS_ASSERT_GREATER_EQUAL:' + getLine(), function (assert) {
                assert.true(a >= b);
            });
        };
        this.TS_ASSERT_LESS_EQUAL = (a, b) => {
            QUnit.test('TS_ASSERT_LESS_EQUAL:' + getLine(), function (assert) {
                assert.true(a <= b);
            });
        };

        this.TS_ASSERT_EQUALS_APPROX = (a, b, eps) => {
            QUnit.test('TS_ASSERT_EQUALS_APPROX:' + getLine(), function (assert) {
                assert.true(Math.abs(a - b) < eps);
            });
        }

        this.ResetState = () => {
            this.Components = {};
        }

        this.AddMock = (ent, iid, mock) => {
            if (!this.Components[ent])
                this.Components[ent] = {};
            this.Components[ent][iid] = mock;
            return this.Components[ent][iid];
        };

        this.DeleteMock = (ent, iid) => {
            if (!this.Components[ent])
                this.Components[ent] = {};
            delete this.Components[ent][iid];
        };

        this.ConstructComponent = (ent, name, template) => {
            let cmp = new this.ComponentTypes[name].ctor();
            Object.defineProperties(cmp, {
                "entity": {
                    "value": ent,
                    "configurable": false,
                    "enumerable": false,
                    "writable": false
                },
                "template": {
                    "value": template && this.deepfreeze(this.clone(template)),
                    "configurable": false,
                    "enumerable": false,
                    "writable": false
                },
                "_cmpName": {
                    "value": name,
                    "configurable": false,
                    "enumerable": false,
                    "writable": false
                }
            });

            cmp.Init();

            if (!this.Components[ent])
                this.Components[ent] = {};
            this.Components[ent][this.ComponentTypes[name].iid] = cmp;

            return cmp;
        };

        this.SerializationCycle = (cmp) => {
            let data;
            if (typeof cmp.Serialize === "function")
                data = cmp.Serialize();
            else {
                data = {};
                for (const att of cmp)
                    if (cmp.hasOwnProperty(att))
                        data[att] = cmp[att];
            }

            const newCmp = this.ConstructComponent(cmp.entity, cmp._cmpName, cmp.template);
            if (typeof newCmp.Deserialize === "function")
                newCmp.Deserialize(data);
            else
                for (const att in data)
                    newCmp[att] = data[att];

            return newCmp;
        };
    }

    RegisterComponentType(iid, name, ctor) {
        this.TS_ASSERT(!this.ComponentTypes[name]);
        this.ComponentTypes[name] = { "iid": iid, "ctor": ctor };
    };

    RegisterSystemComponentType(iid, name, ctor) {
        this.TS_ASSERT(!this.ComponentTypes[name]);
        this.ComponentTypes[name] = { "iid": iid, "ctor": ctor };
    };

    RegisterInterface(name) {
        this["IID_" + name] = this.NewIID++;
    };

    RegisterMessageType(name) {
        this["MT_" + name] = this.NewMTID++;
    };

    RegisterGlobal(name, value) {
        this[name] = value;
    };
}
