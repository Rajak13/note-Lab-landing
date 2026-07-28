/**
 * LabApparatusDictionary.js
 * Data-driven parametric geometry, ports, and default properties for 25+ EdrawMax-grade chemistry apparatus.
 */

export const APPARATUS_CATEGORIES = [
  { id: 'glassware', label: 'Glassware & Flasks' },
  { id: 'tubing', label: 'Tubing & Fittings' },
  { id: 'heating', label: 'Heating & Supports' },
  { id: 'measurement', label: 'Measurement & Filtration' },
];

export const LIQUID_COLORS = [
  { id: 'clear', label: 'Clear Water', color: 'rgba(200, 230, 255, 0.45)', border: '#60A5FA' },
  { id: 'copper', label: 'Copper Sulfate (Cyan)', color: 'rgba(6, 182, 212, 0.6)', border: '#0891B2' },
  { id: 'kmno4', label: 'Permanganate (Purple)', color: 'rgba(168, 85, 247, 0.65)', border: '#7E22CE' },
  { id: 'pink', label: 'Phenolphthalein (Pink)', color: 'rgba(244, 114, 182, 0.65)', border: '#DB2777' },
  { id: 'amber', label: 'Bromine / Amber', color: 'rgba(245, 158, 11, 0.65)', border: '#D97706' },
  { id: 'green', label: 'Nickel Green', color: 'rgba(34, 197, 94, 0.65)', border: '#16A34A' },
];

export const LAB_APPARATUS = {
  // ── Glassware & Flasks ──
  beaker: {
    id: 'beaker',
    name: 'Beaker',
    category: 'glassware',
    width: 80,
    height: 90,
    hasLiquid: true,
    ports: [
      { id: 'top', x: 40, y: 0, angle: 90, label: 'Mouth' },
      { id: 'spout', x: 75, y: 8, angle: 45, label: 'Pour Spout' },
      { id: 'bottom', x: 40, y: 90, angle: 270, label: 'Base' },
      { id: 'left', x: 0, y: 45, angle: 180, label: 'Left Wall' },
      { id: 'right', x: 80, y: 45, angle: 0, label: 'Right Wall' },
    ],
  },
  erlenmeyer: {
    id: 'erlenmeyer',
    name: 'Erlenmeyer Flask',
    category: 'glassware',
    width: 85,
    height: 100,
    hasLiquid: true,
    ports: [
      { id: 'neckTop', x: 42.5, y: 0, angle: 90, label: 'Neck Top' },
      { id: 'baseCenter', x: 42.5, y: 100, angle: 270, label: 'Base' },
      { id: 'leftSlope', x: 15, y: 70, angle: 210, label: 'Left Slope' },
      { id: 'rightSlope', x: 70, y: 70, angle: 330, label: 'Right Slope' },
    ],
  },
  roundFlask: {
    id: 'roundFlask',
    name: 'Round-Bottom Flask',
    category: 'glassware',
    width: 85,
    height: 105,
    hasLiquid: true,
    ports: [
      { id: 'neck', x: 42.5, y: 0, angle: 90, label: 'Neck Mouth' },
      { id: 'sideArm', x: 62, y: 25, angle: 30, label: 'Side-Arm Adapter' },
      { id: 'bottom', x: 42.5, y: 105, angle: 270, label: 'Bottom Bulb' },
      { id: 'leftBulb', x: 5, y: 65, angle: 180, label: 'Left Bulb' },
      { id: 'rightBulb', x: 80, y: 65, angle: 0, label: 'Right Bulb' },
    ],
  },
  testTube: {
    id: 'testTube',
    name: 'Test Tube',
    category: 'glassware',
    width: 32,
    height: 110,
    hasLiquid: true,
    ports: [
      { id: 'top', x: 16, y: 0, angle: 90, label: 'Mouth' },
      { id: 'bottom', x: 16, y: 110, angle: 270, label: 'Rounded Base' },
      { id: 'middle', x: 16, y: 55, angle: 0, label: 'Tube Clamp Point' },
    ],
  },
  graduatedCylinder: {
    id: 'graduatedCylinder',
    name: 'Graduated Cylinder',
    category: 'glassware',
    width: 44,
    height: 120,
    hasLiquid: true,
    ports: [
      { id: 'top', x: 22, y: 0, angle: 90, label: 'Top Lip' },
      { id: 'base', x: 22, y: 120, angle: 270, label: 'Hex Base' },
    ],
  },
  reagentBottle: {
    id: 'reagentBottle',
    name: 'Reagent Bottle',
    category: 'glassware',
    width: 65,
    height: 95,
    hasLiquid: true,
    ports: [
      { id: 'stopper', x: 32.5, y: 0, angle: 90, label: 'Glass Stopper' },
      { id: 'base', x: 32.5, y: 95, angle: 270, label: 'Base' },
    ],
  },
  evaporatingDish: {
    id: 'evaporatingDish',
    name: 'Evaporating Dish',
    category: 'glassware',
    width: 80,
    height: 40,
    hasLiquid: true,
    ports: [
      { id: 'top', x: 40, y: 0, angle: 90, label: 'Dish Rim' },
      { id: 'bottom', x: 40, y: 40, angle: 270, label: 'Dish Base' },
    ],
  },
  mortarPestle: {
    id: 'mortarPestle',
    name: 'Mortar & Pestle',
    category: 'glassware',
    width: 80,
    height: 60,
    ports: [
      { id: 'mortarRim', x: 40, y: 10, angle: 90, label: 'Mortar Rim' },
      { id: 'pestleHandle', x: 60, y: 0, angle: 45, label: 'Pestle Handle' },
    ],
  },

  // ── Tubing & Fittings ──
  liebigCondenser: {
    id: 'liebigCondenser',
    name: 'Liebig Condenser',
    category: 'tubing',
    width: 140,
    height: 50,
    ports: [
      { id: 'inletVapor', x: 0, y: 25, angle: 180, label: 'Vapor Inlet' },
      { id: 'outletVapor', x: 140, y: 25, angle: 0, label: 'Liquid Outlet' },
      { id: 'waterIn', x: 110, y: 48, angle: 270, label: 'Cooling Water IN' },
      { id: 'waterOut', x: 30, y: 2, angle: 90, label: 'Cooling Water OUT' },
    ],
  },
  separatoryFunnel: {
    id: 'separatoryFunnel',
    name: 'Separatory Funnel',
    category: 'tubing',
    width: 60,
    height: 120,
    hasLiquid: true,
    ports: [
      { id: 'topStopper', x: 30, y: 0, angle: 90, label: 'Top Stopper' },
      { id: 'stopcock', x: 30, y: 90, angle: 0, label: 'Stopcock Valve' },
      { id: 'dripTip', x: 30, y: 120, angle: 270, label: 'Drip Tip' },
    ],
  },
  elbowTube: {
    id: 'elbowTube',
    name: '90° Glass Elbow Tube',
    category: 'tubing',
    width: 50,
    height: 50,
    ports: [
      { id: 'start', x: 0, y: 12, angle: 180, label: 'Horizontal End' },
      { id: 'end', x: 38, y: 50, angle: 270, label: 'Vertical End' },
    ],
  },
  uTube: {
    id: 'uTube',
    name: 'Glass U-Tube',
    category: 'tubing',
    width: 50,
    height: 70,
    hasLiquid: true,
    ports: [
      { id: 'leftTop', x: 12, y: 0, angle: 90, label: 'Left Tube Top' },
      { id: 'rightTop', x: 38, y: 0, angle: 90, label: 'Right Tube Top' },
      { id: 'bottomCurve', x: 25, y: 70, angle: 270, label: 'Bottom Bend' },
    ],
  },
  rubberStopper: {
    id: 'rubberStopper',
    name: 'Rubber Stopper',
    category: 'tubing',
    width: 40,
    height: 30,
    ports: [
      { id: 'hole1', x: 14, y: 0, angle: 90, label: 'Hole 1' },
      { id: 'hole2', x: 26, y: 0, angle: 90, label: 'Hole 2' },
      { id: 'base', x: 20, y: 30, angle: 270, label: 'Stopper Base' },
    ],
  },
  burette: {
    id: 'burette',
    name: 'Burette with Stopcock',
    category: 'tubing',
    width: 30,
    height: 140,
    hasLiquid: true,
    ports: [
      { id: 'topFunnel', x: 15, y: 0, angle: 90, label: 'Burette Top' },
      { id: 'stopcock', x: 15, y: 110, angle: 0, label: 'Stopcock' },
      { id: 'tip', x: 15, y: 140, angle: 270, label: 'Dispense Tip' },
    ],
  },
  thermometer: {
    id: 'thermometer',
    name: 'Lab Thermometer',
    category: 'tubing',
    width: 20,
    height: 120,
    ports: [
      { id: 'bulb', x: 10, y: 120, angle: 270, label: 'Mercury Bulb' },
      { id: 'topCap', x: 10, y: 0, angle: 90, label: 'Glass Eye Top' },
    ],
  },

  // ── Heating & Supports ──
  bunsenBurner: {
    id: 'bunsenBurner',
    name: 'Bunsen Burner',
    category: 'heating',
    width: 70,
    height: 100,
    hasFlame: true,
    ports: [
      { id: 'flameTip', x: 35, y: 0, angle: 90, label: 'Flame Outlet' },
      { id: 'gasInlet', x: 70, y: 88, angle: 0, label: 'Gas Hose Inlet' },
      { id: 'base', x: 35, y: 100, angle: 270, label: 'Heavy Base' },
    ],
  },
  spiritLamp: {
    id: 'spiritLamp',
    name: 'Alcohol Spirit Lamp',
    category: 'heating',
    width: 65,
    height: 75,
    hasFlame: true,
    ports: [
      { id: 'wickFlame', x: 32.5, y: 0, angle: 90, label: 'Wick Flame' },
      { id: 'base', x: 32.5, y: 75, angle: 270, label: 'Glass Base' },
    ],
  },
  hotPlate: {
    id: 'hotPlate',
    name: 'Hot Plate & Stirrer',
    category: 'heating',
    width: 100,
    height: 55,
    ports: [
      { id: 'heatingSurface', x: 50, y: 10, angle: 90, label: 'Heating Top' },
      { id: 'base', x: 50, y: 55, angle: 270, label: 'Base Stand' },
    ],
  },
  tripodStand: {
    id: 'tripodStand',
    name: 'Tripod Stand & Gauze',
    category: 'heating',
    width: 90,
    height: 110,
    ports: [
      { id: 'gauzeTop', x: 45, y: 10, angle: 90, label: 'Wire Gauze Surface' },
      { id: 'burnerSpace', x: 45, y: 70, angle: 270, label: 'Underneath Burner Spot' },
    ],
  },
  retortStand: {
    id: 'retortStand',
    name: 'Retort Support Stand',
    category: 'heating',
    width: 90,
    height: 150,
    ports: [
      { id: 'clampRing', x: 60, y: 50, angle: 0, label: 'Utility Clamp Grip' },
      { id: 'ringClamp', x: 60, y: 90, angle: 0, label: 'Ring Support' },
      { id: 'rodTop', x: 15, y: 0, angle: 90, label: 'Rod Top' },
      { id: 'baseCenter', x: 45, y: 150, angle: 270, label: 'Heavy Base' },
    ],
  },

  // ── Measurement & Filtration ──
  digitalScale: {
    id: 'digitalScale',
    name: 'Digital Precision Balance',
    category: 'measurement',
    width: 100,
    height: 50,
    ports: [
      { id: 'pan', x: 50, y: 8, angle: 90, label: 'Weighing Pan' },
      { id: 'base', x: 50, y: 50, angle: 270, label: 'Base' },
    ],
  },
  filterFunnel: {
    id: 'filterFunnel',
    name: 'Filter Funnel & Paper',
    category: 'measurement',
    width: 60,
    height: 80,
    ports: [
      { id: 'topCone', x: 30, y: 0, angle: 90, label: 'Funnel Cone' },
      { id: 'stemTip', x: 30, y: 80, angle: 270, label: 'Stem Drip Tip' },
    ],
  },
  buchnerFlask: {
    id: 'buchnerFlask',
    name: 'Buchner Vacuum Flask',
    category: 'measurement',
    width: 85,
    height: 105,
    hasLiquid: true,
    ports: [
      { id: 'topMouth', x: 42.5, y: 0, angle: 90, label: 'Top Mouth' },
      { id: 'vacuumNozzle', x: 65, y: 25, angle: 0, label: 'Vacuum Hose Barb' },
      { id: 'base', x: 42.5, y: 105, angle: 270, label: 'Base' },
    ],
  },
  washBottle: {
    id: 'washBottle',
    name: 'Plastic Wash Bottle',
    category: 'measurement',
    width: 60,
    height: 110,
    hasLiquid: true,
    ports: [
      { id: 'nozzleTip', x: 48, y: 0, angle: 45, label: 'Squeeze Nozzle Tip' },
      { id: 'cap', x: 30, y: 25, angle: 90, label: 'Screw Cap' },
      { id: 'base', x: 30, y: 110, angle: 270, label: 'Base' },
    ],
  },
};

// ── Preset Complex Experiment Assemblies (Scientific Textbook Edition) ──
export const PRESET_EXPERIMENTS = [
  {
    id: 'simpleDistillation',
    name: 'Simple Distillation Setup',
    description: 'Round flask on heating stand connected to Liebig condenser & receiving flask.',
    nodes: [
      { id: 'dist_stand', shape: 'retortStand', x: 100, y: 120, hideLabel: true },
      { id: 'dist_burner', shape: 'bunsenBurner', x: 135, y: 280, flameOn: true, leaderLine: { targetX: 35, targetY: 50, dx: -140, dy: 30, side: 'left' }, label: 'Bunsen Burner (Heat Source)' },
      { id: 'dist_flask', shape: 'roundFlask', x: 128, y: 170, liquidLevel: 60, liquidColor: 'rgba(245, 158, 11, 0.5)', leaderLine: { targetX: 10, targetY: 60, dx: -140, dy: -20, side: 'left' }, label: 'Distillation Flask (Solution)' },
      { id: 'dist_thermo', shape: 'thermometer', x: 160, y: 100, leaderLine: { targetX: 4, targetY: 10, dx: -140, dy: -50, side: 'left' }, label: 'Thermometer (Vapor Junction)' },
      { id: 'dist_condenser', shape: 'liebigCondenser', x: 270, y: 185, leaderLine: { targetX: 70, targetY: 0, dx: 0, dy: -80, side: 'right' }, label: 'Liebig Condenser (Water Jacket)' },
      { id: 'dist_receiver', shape: 'erlenmeyer', x: 450, y: 260, liquidLevel: 35, liquidColor: 'rgba(200, 230, 255, 0.45)', leaderLine: { targetX: 70, targetY: 70, dx: 110, dy: 20, side: 'right' }, label: 'Receiving Flask (Distillate)' },
    ],
    edges: [
      { id: 'e1', source: 'dist_flask', sourcePort: 'sideArm', target: 'dist_condenser', targetPort: 'inletVapor', type: 'orthogonal', label: 'Vapor Flow', dashStyle: 'solid', color: '#E46757' },
      { id: 'e2', source: 'dist_condenser', sourcePort: 'outletVapor', target: 'dist_receiver', targetPort: 'neckTop', type: 'orthogonal', label: 'Distillate Flow', dashStyle: 'solid', color: '#3B82F6' },
    ],
  },
  {
    id: 'titrationSetup',
    name: 'Acid-Base Titration Assembly',
    description: 'Calibrated Burette clamped above an Erlenmeyer flask with magnetic stirrer.',
    nodes: [
      { id: 'tit_stand', shape: 'retortStand', x: 220, y: 60, hideLabel: true },
      { id: 'tit_burette', shape: 'burette', x: 285, y: 60, liquidLevel: 75, liquidColor: 'rgba(200, 230, 255, 0.45)', leaderLine: { targetX: 15, targetY: 40, dx: 120, dy: -20, side: 'right' }, label: '50mL Calibrated Burette (Titrant)' },
      { id: 'tit_flask', shape: 'erlenmeyer', x: 257, y: 250, liquidLevel: 45, liquidColor: 'rgba(244, 114, 182, 0.55)', leaderLine: { targetX: 75, targetY: 70, dx: 120, dy: 20, side: 'right' }, label: 'Erlenmeyer Flask (Analyte + Indicator)' },
      { id: 'tit_stirrer', shape: 'hotPlate', x: 250, y: 355, leaderLine: { targetX: 10, targetY: 25, dx: -140, dy: 15, side: 'left' }, label: 'White Ceramic Tile / Stirrer Plate' },
    ],
    edges: [
      { id: 'te1', source: 'tit_burette', sourcePort: 'tip', target: 'tit_flask', targetPort: 'neckTop', type: 'straight', label: 'Titrant Drops', dashStyle: 'dashed', color: '#DB2777' },
    ],
  },
  {
    id: 'gasEvolution',
    name: 'Gas Generation & Collection',
    description: 'Reaction flask with delivery tube leading gas into inverted jar/tube.',
    nodes: [
      { id: 'gas_flask', shape: 'erlenmeyer', x: 100, y: 160, liquidLevel: 50, liquidColor: 'rgba(6, 182, 212, 0.5)', leaderLine: { targetX: 10, targetY: 60, dx: -130, dy: -20, side: 'left' }, label: 'Reaction Flask (Zn + Dilute HCl)' },
      { id: 'gas_stopper', shape: 'rubberStopper', x: 122, y: 138, hideLabel: true },
      { id: 'gas_tube', shape: 'elbowTube', x: 210, y: 120, leaderLine: { targetX: 25, targetY: 0, dx: 0, dy: -60, side: 'right' }, label: 'Bent Glass Delivery Tube' },
      { id: 'gas_jar', shape: 'testTube', x: 360, y: 150, liquidLevel: 25, liquidColor: 'rgba(200, 230, 255, 0.3)', leaderLine: { targetX: 25, targetY: 50, dx: 120, dy: -20, side: 'right' }, label: 'Inverted Collector Tube (Gas Displacement)' },
    ],
    edges: [
      { id: 'ge1', source: 'gas_flask', sourcePort: 'neckTop', target: 'gas_tube', targetPort: 'start', type: 'orthogonal', label: 'Gas Flow', dashStyle: 'dotted', color: '#10B981' },
      { id: 'ge2', source: 'gas_tube', sourcePort: 'end', target: 'gas_jar', targetPort: 'top', type: 'orthogonal', label: 'Gas Collection', dashStyle: 'dotted', color: '#10B981' },
    ],
  },
];
