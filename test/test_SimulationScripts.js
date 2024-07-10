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
      obj.RegisterMessageType("VisionSharingChanged");
      obj.RegisterInterface("Attack");
      obj.RegisterInterface("CinemaManager");
      obj.RegisterInterface("Fogging");
      obj.RegisterInterface("Footprint");
      obj.RegisterInterface("GarrisonHolder");
      obj.RegisterInterface("GuiInterface");
      obj.RegisterInterface("Identity");
      obj.RegisterInterface("Mirage");
      obj.RegisterInterface("Obstruction");
      obj.RegisterInterface("ObstructionManager");
      obj.RegisterInterface("Ownership");
      obj.RegisterInterface("Player");
      obj.RegisterInterface("PlayerManager");
      obj.RegisterInterface("Position");
      obj.RegisterInterface("ProjectileManager");
      obj.RegisterInterface("RallyPoint");
      obj.RegisterInterface("RangeManager");
      obj.RegisterInterface("Sound");
      obj.RegisterInterface("TemplateManager");
      obj.RegisterInterface("Terrain");
      obj.RegisterInterface("TerritoryManager");
      obj.RegisterInterface("TurretHolder");
      obj.RegisterInterface("UnitMotion");
      obj.RegisterInterface("Visual");
      obj.RegisterInterface("Pathfinder");
      obj.RegisterInterface("RallyPointRenderer");
      obj.RegisterInterface("WaterManager");
      obj.RegisterInterface("Vision");
      return obj;
    };

    global.Engine.TestModule("simulation/components/tests", contextFactory);
    return 0;
  }
}

const program = new Program();
program.main();
