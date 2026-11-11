import { BinaryMapLoader, MapData } from './loaders/BinaryMapLoader';
import { Camera } from './core/Camera';
import { IsometricMath, Point2D } from './core/IsometricMath';
import { TilemapRenderer } from './renderer/TilemapRenderer';
import { SpriteRenderer } from './renderer/SpriteRenderer';
import { Villager } from './simulation/Villager';

class PrehistoricTribesApp {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera: Camera;

  private map: MapData | null = null;
  private tileRenderer: TilemapRenderer | null = null;
  private spriteRenderer: SpriteRenderer | null = null;

  private villagers: Villager[] = [];
  private selectedVillagerId: number | null = null;

  private hoveredTile: Point2D | null = null;
  private isDragging: boolean = false;
  private dragStart: Point2D = { x: 0, y: 0 };

  private lastTime: number = 0;

  // Global Economic Resources
  private resources = {
    food: 120,
    wood: 60,
    stone: 40,
    bones: 15,
    population: 3,
    maxLivingSpace: 8
  };

  constructor() {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.camera = new Camera(window.innerWidth, window.innerHeight);

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.setupInputs();
    this.initGame();
  }

  private resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.camera.viewportWidth = window.innerWidth;
    this.camera.viewportHeight = window.innerHeight;
  }

  private async initGame(): Promise<void> {
    try {
      // 1. Load Level 0 Map
      this.map = await BinaryMapLoader.loadMap('/assets/maps/00_outside.bin', 0);

      // 2. Load Unit Spritesheet
      const unitImg = new Image();
      unitImg.src = '/assets/images/pi9.png';
      await new Promise((res) => { unitImg.onload = res; unitImg.onerror = res; });

      this.tileRenderer = new TilemapRenderer(this.map);
      this.spriteRenderer = new SpriteRenderer(unitImg);

      // 3. Spawn Initial Avnotaklu Tribe Members
      const chief = new Villager(1, 'Chief', 'male', 15, 12, true);
      const mumbo = new Villager(2, 'Mumbo', 'male', 16, 13, false);
      const kazza = new Villager(3, 'Kazza', 'female', 14, 14, false);

      this.villagers = [chief, mumbo, kazza];
      this.selectedVillagerId = chief.id;

      // 4. Center Camera on the Chief
      const chiefWorld = IsometricMath.tileToWorld(chief.x, chief.y);
      this.camera.setPosition(chiefWorld.x, chiefWorld.y);

      // 5. Start Game Loop
      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.loop(t));

      this.updateHUD();
    } catch (e) {
      console.error('Failed to initialize game:', e);
    }
  }

  private setupInputs(): void {
    // Mouse Move (Tracking & Panning)
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;
        this.camera.pan(-dx, -dy);
        this.dragStart = { x: e.clientX, y: e.clientY };
      } else {
        const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
        this.hoveredTile = IsometricMath.worldToTile(worldPos.x, worldPos.y);
      }
    });

    // Mouse Down (Left click select, Middle click pan)
    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        // Left Click: Unit or Tile selection
        const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
        const tile = IsometricMath.worldToTile(worldPos.x, worldPos.y);

        // Check if clicked near any villager
        let clickedVillager: Villager | null = null;
        for (const v of this.villagers) {
          const dist = Math.hypot(v.x - tile.x, v.y - tile.y);
          if (dist < 1.2) {
            clickedVillager = v;
            break;
          }
        }

        if (clickedVillager) {
          this.selectedVillagerId = clickedVillager.id;
        } else {
          // If clicked elsewhere, retain or deselect
        }
        this.updateInspector();
      } else if (e.button === 1) {
        // Middle Click: Start Dragging
        this.isDragging = true;
        this.dragStart = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Right Click: Contextual Command (Move unit)
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
      const targetTile = IsometricMath.worldToTile(worldPos.x, worldPos.y);

      if (this.selectedVillagerId !== null) {
        const selected = this.villagers.find((v) => v.id === this.selectedVillagerId);
        if (selected) {
          selected.moveTo(targetTile.x, targetTile.y);
        }
      }
    });

    // Mouse Wheel: Zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      this.camera.zoomAt(delta, { x: e.clientX, y: e.clientY });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        const chief = this.villagers.find((v) => v.isChief);
        if (chief) {
          const worldPos = IsometricMath.tileToWorld(chief.x, chief.y);
          this.camera.setPosition(worldPos.x, worldPos.y);
        }
      } else if (e.key === 'w' || e.key === 'ArrowUp') {
        this.camera.pan(0, -30);
      } else if (e.key === 's' || e.key === 'ArrowDown') {
        this.camera.pan(0, 30);
      } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        this.camera.pan(-30, 0);
      } else if (e.key === 'd' || e.key === 'ArrowRight') {
        this.camera.pan(30, 0);
      }
    });
  }

  private loop(timestamp: number): void {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    // Simulation updates
    for (const v of this.villagers) {
      v.update(dt);
    }

    // Render pass
    this.ctx.fillStyle = '#1c2813'; // Dark earth border
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.map && this.tileRenderer) {
      this.tileRenderer.render(this.ctx, this.camera, this.hoveredTile);
    }

    if (this.spriteRenderer) {
      this.spriteRenderer.renderVillagers(this.ctx, this.villagers, this.selectedVillagerId, this.camera);
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  private updateHUD(): void {
    const foodEl = document.getElementById('res-food');
    const woodEl = document.getElementById('res-wood');
    const stoneEl = document.getElementById('res-stone');
    const bonesEl = document.getElementById('res-bones');
    const popEl = document.getElementById('res-pop');

    if (foodEl) foodEl.innerText = `${Math.floor(this.resources.food)}`;
    if (woodEl) woodEl.innerText = `${this.resources.wood}`;
    if (stoneEl) stoneEl.innerText = `${this.resources.stone}`;
    if (bonesEl) bonesEl.innerText = `${this.resources.bones}`;
    if (popEl) popEl.innerText = `${this.resources.population} / ${this.resources.maxLivingSpace}`;
  }

  private updateInspector(): void {
    const inspectorEl = document.getElementById('inspector-panel');
    if (!inspectorEl) return;

    const selected = this.villagers.find((v) => v.id === this.selectedVillagerId);
    if (selected) {
      inspectorEl.style.display = 'block';
      inspectorEl.innerHTML = `
        <div style="font-weight: bold; color: #fde047; margin-bottom: 4px;">${selected.name} ${selected.isChief ? '👑 (Chief)' : ''}</div>
        <div>Health: ${Math.floor(selected.health)} / 100</div>
        <div>Hunger: ${Math.floor(selected.hunger)}%</div>
        <div>Tiredness: ${Math.floor(selected.tiredness)}%</div>
        <div>Happiness: ${Math.floor(selected.happiness)}%</div>
        <div>Status: <span style="color: #4ade80;">${selected.state.toUpperCase()}</span></div>
      `;
    } else {
      inspectorEl.style.display = 'none';
    }
  }
}

// Bootstrap on DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  new PrehistoricTribesApp();
});
