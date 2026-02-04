
import { SystemTemplate } from '../types';
import { quantumInvestBlueprint } from './blueprints/quantumInvest';
import { nexusHealthBlueprint } from './blueprints/nexusHealth';
import { logiCoreBlueprint } from './blueprints/logiCore';
import { nexusMfgCommerceBlueprint } from './blueprints/nexusMfgCommerce';
import { nexusMasterERPBlueprint } from './blueprints/nexusMasterERP';

export const ALL_BLUEPRINTS: SystemTemplate[] = [
    nexusMasterERPBlueprint,
    quantumInvestBlueprint,
    nexusHealthBlueprint,
    logiCoreBlueprint,
    nexusMfgCommerceBlueprint,
];
