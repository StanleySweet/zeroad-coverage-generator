import { PyrogenesisEngine } from '../PyrogenesisEngine.js'
import { PyrogenesisContext } from '../PyrogenesisContext.js'
class Program {
  /**
   * Entry point of the program.
   * @returns
   */
  main() {
    (global).Engine = new PyrogenesisEngine();
    const contextFactory = (self) =>
    {
      const obj =  new PyrogenesisContext(self);
      obj.SYSTEM_ENTITY = 1;
      obj.INVALID_PLAYER = -1;
      obj.INVALID_ENTITY = -1;
      obj.RegisterMessageType("TemplateModification");
      obj.RegisterMessageType("ValueModification");
      obj.RegisterInterface("Attack");
      obj.RegisterInterface("PlayerManager");
      obj.RegisterInterface("Player");
      obj.RegisterInterface("Position");
      obj.RegisterInterface("Ownership");
      obj.RegisterInterface("Identity");
      obj.RegisterInterface("Mirage");
      obj.RegisterInterface("RangeManager");
      obj.RegisterInterface("Footprint");
      return obj;
    };

    global.Engine.TestModule("simulation/helpers/tests", contextFactory);
    return 0;
  }
}

const program = new Program();
program.main();
