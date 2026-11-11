const HD = './assets/images/sprites_hd';
const PACK = './assets/images/sample_pack';

export const ASSET_MANIFEST = {
  // Isometric 3D Terrain Tiles (Image 3)
  tile_grass_pebbles: `${HD}/tile_iso_grass_pebbles.png`,
  tile_grass_flowers: `${HD}/tile_iso_grass_flowers.png`,
  tile_dirt_trail: `${HD}/tile_iso_dirt_trail.png`,
  tile_water: `${HD}/tile_iso_water.png`,

  // Terrain & Water Props (Sample Pack)
  floor_grass: `${PACK}/dino_architecture_floor_jungle_grass_01.png`,
  floor_dirt: `${PACK}/dino_architecture_path_dirt_trail_01.png`,
  wall_cliff: `${PACK}/dino_architecture_wall_rock_cliff_01.png`,
  pond: `${PACK}/dino_water_swamp_lily_pad_pond_01.png`,
  waterfall: `${PACK}/dino_water_swamp_rock_waterfall_01.png`,
  log_bridge: `${PACK}/dino_water_swamp_natural_log_bridge_01.png`,

  // Trees, Flora, Resources & Depleted States
  tree_conifer: `${PACK}/dino_trees_conifer_giant_01.png`,
  tree_palm: `${PACK}/dino_trees_prehistoric_palm_tree_01.png`,
  tree_stump: `${HD}/node_tree_stump.png`,
  fallen_log: `${PACK}/dino_trees_fallen_log_mossy_01.png`,
  fern: `${PACK}/dino_jungle_plants_giant_fern_01.png`,
  flower_red: `${PACK}/dino_jungle_plants_prehistoric_flower_red_01.png`,
  fungus: `${PACK}/dino_jungle_plants_glowing_fungus_01.png`,
  crystal: `${PACK}/dino_rocks_volcanic_cave_crystal_cluster_01.png`,
  volcano: `${PACK}/dino_rocks_volcanic_small_smoking_volcano_01.png`,
  lava: `${PACK}/dino_rocks_volcanic_glowing_lava_flow_01.png`,
  skeleton: `${PACK}/dino_fossils_bones_dino_skeleton_full_01.png`,
  skull: `${PACK}/dino_fossils_bones_triceratops_skull_horned_01.png`,
  amber: `${PACK}/dino_fossils_bones_amber_with_bug_01.png`,
  berry_bush: `${HD}/node_berry_bush.png`,
  berry_bush_depleted: `${HD}/node_berry_bush_depleted.png`,
  stone_boulder: `${HD}/node_stone_boulder.png`,
  stone_depleted: `${HD}/node_stone_depleted.png`,
  animal_carcass: `${HD}/prop_animal_carcass.png`,
  signpost: `${HD}/prop_signpost.png`,
  spike_trap: `${HD}/prop_spike_trap.png`,

  // Complete Tribe Buildings (All 12 definitions + upgrades)
  bld_chiefs_hut: `${HD}/bld_chiefs_hut.png`,
  bld_chiefs_hut_lvl2: `${HD}/bld_chiefs_hut_lvl2.png`,
  bld_hut: `${PACK}/dino_tribe_camp_hide_tent_hut_01.png`,
  bld_bone_hut: `${HD}/bld_bone_hut.png`,
  bld_mammoth_shelter: `${HD}/bld_mammoth_shelter.png`,
  bld_store: `${HD}/bld_storehouse.png`,
  bld_kitchen: `${HD}/bld_kitchen.png`,
  bld_disco: `${HD}/bld_disco.png`,
  bld_watchtower: `${HD}/bld_watchtower.png`,
  bld_armoury: `${HD}/bld_armoury.png`,
  bld_nursery: `${HD}/bld_nursery.png`,
  bld_sanctuary: `${HD}/bld_sanctuary.png`,
  bld_pia_shrine: `${HD}/bld_pia_shrine.png`,
  bld_fishing_pier: `${HD}/bld_fishing_pier.png`,
  bld_training_center: `${HD}/bld_training_center.png`,
  bld_scaffolding: `${HD}/bld_scaffolding.png`,
  bld_campfire: `${PACK}/dino_tribe_camp_campfire_stones_01.png`,
  bld_totem: `${PACK}/dino_tribe_camp_bone_skull_totem_01.png`,

  // Wildlife (Front, Back & Attack poses) + Dinosaurs
  animal_mammoth: `${HD}/animal_mammoth.png`,
  animal_mammoth_back: `${HD}/animal_mammoth_back.png`,
  animal_mammoth_attack: `${HD}/animal_mammoth_attack.png`,

  animal_sabertooth: `${HD}/animal_sabertooth.png`,
  animal_sabertooth_back: `${HD}/animal_sabertooth_back.png`,
  animal_sabertooth_attack: `${HD}/animal_sabertooth_attack.png`,

  animal_boar: `${HD}/animal_boar.png`,
  animal_boar_back: `${HD}/animal_boar_back.png`,
  animal_boar_attack: `${HD}/animal_boar_attack.png`,

  animal_trex: `${PACK}/dino_dinosaurs_trex_adult_01.png`,
  animal_triceratops: `${PACK}/dino_dinosaurs_triceratops_01.png`,
  animal_brontosaurus: `${PACK}/dino_dinosaurs_brontosaurus_longneck_01.png`,

  // Male Villager (8-dir + Full Action Suite)
  char_male_idle: `${HD}/char_male_idle.png`,
  char_male_walk1: `${HD}/char_male_walk1.png`,
  char_male_walk2: `${HD}/char_male_walk2.png`,
  char_male_walk3: `${HD}/char_male_walk3.png`,
  char_male_south_walk1: `${HD}/char_male_south_walk1.png`,
  char_male_south_walk2: `${HD}/char_male_south_walk2.png`,
  char_male_north_walk1: `${HD}/char_male_north_walk1.png`,
  char_male_work1: `${HD}/char_male_work1.png`,
  char_male_work2: `${HD}/char_male_work2.png`,
  char_male_back_walk: `${HD}/char_male_back_walk.png`,
  char_male_back_work: `${HD}/char_male_back_work.png`,
  char_male_back_carry: `${HD}/char_male_back_carry.png`,
  char_male_back_mine: `${HD}/char_male_back_mine.png`,
  char_male_back_hunt: `${HD}/char_male_back_hunt.png`,
  char_male_back_fight: `${HD}/char_male_back_fight.png`,
  char_male_hunt: `${HD}/char_male_hunt.png`,
  char_male_mine: `${HD}/char_male_mine.png`,
  char_male_carry: `${HD}/char_male_carry.png`,
  char_male_carry_stone: `${HD}/char_male_carry_stone.png`,
  char_male_fight: `${HD}/char_male_fight.png`,
  char_male_eat: `${HD}/char_male_eat.png`,
  char_male_sleep: `${HD}/char_male_sleep.png`,
  char_male_relax: `${HD}/char_male_relax.png`,
  char_male_build: `${HD}/char_male_build.png`,
  char_male_fish: `${HD}/char_male_fish.png`,
  char_male_pray: `${HD}/char_male_pray.png`,
  char_male_craft: `${HD}/char_male_craft.png`,
  char_male_tired: `${HD}/char_male_tired.png`,
  char_male_hurt: `${HD}/char_male_hurt.png`,
  char_male_cheer: `${HD}/char_male_cheer.png`,
  char_male_swim: `${HD}/char_male_swim.png`,

  // Female Villager (8-dir + Full Action Suite)
  char_female_idle: `${HD}/char_female_idle.png`,
  char_female_walk1: `${HD}/char_female_walk1.png`,
  char_female_walk2: `${HD}/char_female_walk2.png`,
  char_female_south_walk1: `${HD}/char_female_south_walk1.png`,
  char_female_north_walk1: `${HD}/char_female_north_walk1.png`,
  char_female_work1: `${HD}/char_female_work1.png`,
  char_female_work2: `${HD}/char_female_work2.png`,
  char_female_back_walk: `${HD}/char_female_back_walk.png`,
  char_female_back_work: `${HD}/char_female_back_work.png`,
  char_female_back_chop: `${HD}/char_female_back_chop.png`,
  char_female_back_carry: `${HD}/char_female_back_carry.png`,
  char_female_chop: `${HD}/char_female_chop.png`,
  char_female_mine: `${HD}/char_female_mine.png`,
  char_female_hunt: `${HD}/char_female_hunt.png`,
  char_female_carry: `${HD}/char_female_carry.png`,
  char_female_eat: `${HD}/char_female_eat.png`,
  char_female_sleep: `${HD}/char_female_sleep.png`,
  char_female_relax: `${HD}/char_female_relax.png`,
  char_female_cook: `${HD}/char_female_cook.png`,
  char_female_fish: `${HD}/char_female_fish.png`,
  char_female_pray: `${HD}/char_female_pray.png`,
  char_female_tend: `${HD}/char_female_tend.png`,
  char_female_tired: `${HD}/char_female_tired.png`,

  // Tribal Chief (8-dir + Full Leadership Suite)
  char_chief_idle: `${HD}/char_chief_idle.png`,
  char_chief_walk1: `${HD}/char_chief_walk1.png`,
  char_chief_walk2: `${HD}/char_chief_walk2.png`,
  char_chief_south_walk1: `${HD}/char_chief_south_walk1.png`,
  char_chief_north_walk1: `${HD}/char_chief_north_walk1.png`,
  char_chief_work1: `${HD}/char_chief_work1.png`,
  char_chief_work2: `${HD}/char_chief_work2.png`,
  char_chief_back_walk: `${HD}/char_chief_back_walk.png`,
  char_chief_back_work: `${HD}/char_chief_back_work.png`,
  char_chief_back_carry: `${HD}/char_chief_back_carry.png`,
  char_chief_back_hunt: `${HD}/char_chief_back_hunt.png`,
  char_chief_carry: `${HD}/char_chief_carry.png`,
  char_chief_mine: `${HD}/char_chief_mine.png`,
  char_chief_eat: `${HD}/char_chief_eat.png`,
  char_chief_sleep: `${HD}/char_chief_sleep.png`,
  char_chief_relax: `${HD}/char_chief_relax.png`,
  char_chief_rally: `${HD}/char_chief_rally.png`,
  char_chief_chop: `${HD}/char_chief_chop.png`,
  char_chief_hunt: `${HD}/char_chief_hunt.png`,
  char_chief_command: `${HD}/char_chief_command.png`,
  char_chief_pray: `${HD}/char_chief_pray.png`,
  char_chief_fish: `${HD}/char_chief_fish.png`,
  char_chief_hurt: `${HD}/char_chief_hurt.png`,

  // Cannibal Raider (8-dir + Combat/Ranged/War Dance/Hurt)
  char_cannibal_idle: `${HD}/char_cannibal_idle.png`,
  char_cannibal_walk1: `${HD}/char_cannibal_walk1.png`,
  char_cannibal_walk2: `${HD}/char_cannibal_walk2.png`,
  char_cannibal_south_walk1: `${HD}/char_cannibal_south_walk1.png`,
  char_cannibal_north_walk1: `${HD}/char_cannibal_north_walk1.png`,
  char_cannibal_work1: `${HD}/char_cannibal_work1.png`,
  char_cannibal_work2: `${HD}/char_cannibal_work2.png`,
  char_cannibal_back_walk: `${HD}/char_cannibal_back_walk.png`,
  char_cannibal_back_work: `${HD}/char_cannibal_back_work.png`,
  char_cannibal_back_chop: `${HD}/char_cannibal_back_chop.png`,
  char_cannibal_sneak: `${HD}/char_cannibal_sneak.png`,
  char_cannibal_throw: `${HD}/char_cannibal_throw.png`,
  char_cannibal_dance: `${HD}/char_cannibal_dance.png`,
  char_cannibal_hurt: `${HD}/char_cannibal_hurt.png`,
  char_cannibal_defeated: `${HD}/char_cannibal_defeated.png`,

  // Prehistoric Child (8-dir + Life/Emotions)
  char_child_idle: `${HD}/char_child_idle.png`,
  char_child_walk1: `${HD}/char_child_walk1.png`,
  char_child_walk2: `${HD}/char_child_walk2.png`,
  char_child_south_walk1: `${HD}/char_child_south_walk1.png`,
  char_child_north_walk1: `${HD}/char_child_north_walk1.png`,
  char_child_back_walk: `${HD}/char_child_back_walk.png`,
  char_child_play: `${HD}/char_child_play.png`,
  char_child_back_play: `${HD}/char_child_back_play.png`,
  char_child_eat: `${HD}/char_child_eat.png`,
  char_child_sleep: `${HD}/char_child_sleep.png`,
  char_child_relax: `${HD}/char_child_relax.png`,
  char_child_forage: `${HD}/char_child_forage.png`,
  char_child_cheer: `${HD}/char_child_cheer.png`,
  char_child_hungry: `${HD}/char_child_hungry.png`,
  char_child_tired: `${HD}/char_child_tired.png`,
  prop_baby_cradle: `${HD}/prop_baby_cradle.png`,

  // Promoted Prehistoric Warrior (8-dir, Training, Javelin, Bow, Bush Stealth, Life)
  char_warrior_idle: `${HD}/char_warrior_idle.png`,
  char_warrior_walk1: `${HD}/char_warrior_walk1.png`,
  char_warrior_walk2: `${HD}/char_warrior_walk2.png`,
  char_warrior_south_walk1: `${HD}/char_warrior_south_walk1.png`,
  char_warrior_north_walk1: `${HD}/char_warrior_north_walk1.png`,
  char_warrior_back_walk: `${HD}/char_warrior_back_walk.png`,
  char_warrior_train: `${HD}/char_warrior_train.png`,
  char_warrior_fight: `${HD}/char_warrior_fight.png`,
  char_warrior_back_fight: `${HD}/char_warrior_back_fight.png`,
  char_warrior_throw: `${HD}/char_warrior_throw.png`,
  char_warrior_back_throw: `${HD}/char_warrior_back_throw.png`,
  char_warrior_south_throw: `${HD}/char_warrior_south_throw.png`,
  char_warrior_bow: `${HD}/char_warrior_bow.png`,
  char_warrior_back_bow: `${HD}/char_warrior_back_bow.png`,
  char_warrior_south_bow: `${HD}/char_warrior_south_bow.png`,
  char_warrior_north_combat: `${HD}/char_warrior_north_combat.png`,
  char_warrior_stealth_idle: `${HD}/char_warrior_stealth_idle.png`,
  char_warrior_stealth_walk: `${HD}/char_warrior_stealth_walk.png`,
  char_warrior_stealth_back: `${HD}/char_warrior_stealth_back.png`,
  char_warrior_stealth_south: `${HD}/char_warrior_stealth_south.png`,
  char_warrior_eat: `${HD}/char_warrior_eat.png`,
  char_warrior_sleep: `${HD}/char_warrior_sleep.png`,
  char_warrior_carry: `${HD}/char_warrior_carry.png`,
  char_warrior_pray: `${HD}/char_warrior_pray.png`,
  char_warrior_relax: `${HD}/char_warrior_relax.png`,
  char_warrior_fish: `${HD}/char_warrior_fish.png`,
  char_warrior_hurt: `${HD}/char_warrior_hurt.png`,
  char_warrior_cheer: `${HD}/char_warrior_cheer.png`,
  proj_javelin: `${HD}/proj_javelin.png`,
  proj_arrow: `${HD}/proj_arrow.png`,

  // UI & Icons
  icon_food: `${HD}/icon_food_meat.png`,
  icon_wood: `${HD}/icon_wood_logs.png`,
  icon_bones: `${HD}/icon_bones_crossed.png`,
  icon_pop_caveman: `${HD}/icon_pop_caveman.png`,
  icon_tools: `${HD}/icon_tools_axe_hammer.png`,
  icon_pop_chief: `${HD}/icon_pop_chief.png`,
  icon_portrait_mumbo: `${HD}/icon_portrait_mumbo.png`,
  icon_portrait_female: `${HD}/icon_portrait_female.png`,
  icon_portrait_child: `${HD}/icon_portrait_child.png`,
  icon_portrait_warrior: `${HD}/icon_portrait_warrior.png`
};

export class AssetManager {
  constructor() {
    this.images = {};
  }

  async loadAll() {
    const entries = Object.entries(ASSET_MANIFEST);
    await Promise.all(
      entries.map(([key, src]) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            this.images[key] = img;
            resolve();
          };
          img.onerror = () => {
            console.warn(`AssetManager: failed to load ${key} from ${src}`);
            resolve();
          };
          img.src = src;
        });
      })
    );
    return this.images;
  }

  get(key) {
    const img = this.images[key];
    return img && img.complete && img.naturalWidth > 0 ? img : null;
  }
}
