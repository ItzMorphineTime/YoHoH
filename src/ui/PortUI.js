/**
 * YoHoH — Port UI: Tavern (hire crew), Shipwright (repairs), Market (buy/sell)
 * B.9: Port hub | C.2: Tavern UI | B.7: Market UI
 */

import { CREW, REPAIR, SHIP_CLASSES, UPGRADES, UPGRADE_SLOTS, INFAMY } from '../config.js'; // Port_Improvements.md §1.1
import { getStationFillInfo, getAverageMorale, STATION_NAMES } from '../systems/CrewSystem.js';
import { getGoods, getBuyPrice, getSellPrice } from '../systems/EconomySystem.js';
import { esc } from '../utils/escapeHtml.js'; // Improvements.md §5.3

export class PortUI {
  constructor(container) {
    this.container = container;
    this.overlay = null;
    this.onLeavePort = null;
    this.onHireCrew = null;
    this.onAssignStation = null;
    this.onRepairHull = null;
    this.onRepairSails = null;
    this.onRepairLeaks = null;
    this.onBuyGood = null;
    this.onSellGood = null;
    this.onDismissCrew = null;
    this.onBuyUpgrade = null;
    this.onServeRum = null;
    // Port_Improvements.md §5.5: opens the standalone CrewUI overlay
    this.onManageCrew = null;
  }

  init() {
    this.overlay = document.getElementById('port-overlay');
    if (!this.overlay) return;

    const closeBtn = this.overlay?.querySelector('.port-close-btn');
    const tavernTab = this.overlay?.querySelector('[data-port-tab="tavern"]');
    const shipwrightTab = this.overlay?.querySelector('[data-port-tab="shipwright"]');
    const marketTab = this.overlay?.querySelector('[data-port-tab="market"]');
    const hireBtn = this.overlay?.querySelector('.port-hire-btn');

    closeBtn?.addEventListener('click', () => this.onLeavePort?.());
    tavernTab?.addEventListener('click', () => this._setTab('tavern'));
    const shipClassSelect = this.overlay?.querySelector('#port-ship-class-select');
    shipClassSelect?.addEventListener('change', (e) => {
      const id = e.target.value || null;
      this.onShipClassChange?.(id);
    });
    shipwrightTab?.addEventListener('click', () => this._setTab('shipwright'));
    marketTab?.addEventListener('click', () => this._setTab('market'));
    hireBtn?.addEventListener('click', () => this._onHire());
    this.overlay?.querySelector('#port-serve-rum')?.addEventListener('click', () => this.onServeRum?.());
    // Port_Improvements.md §5.5: "Manage Crew" opens the standalone overlay
    this.overlay?.querySelector('#port-manage-crew')?.addEventListener('click', () => this.onManageCrew?.());
    this.overlay?.querySelector('#port-repair-hull')?.addEventListener('click', () => this.onRepairHull?.());
    this.overlay?.querySelector('#port-repair-sails')?.addEventListener('click', () => this.onRepairSails?.());
    this.overlay?.querySelector('#port-repair-leaks')?.addEventListener('click', () => this.onRepairLeaks?.());
    // Port_Improvements.md §3.8: clear the activity log
    this.overlay?.querySelector('#port-action-log-clear')?.addEventListener('click', () => {
      this._lastPortScene?.clearLog?.();
      this._updateActionLog(this._lastPortScene);
    });

    // Port_Improvements.md §3.2: Esc-to-leave with a brief confirmation window.
    // First Esc shows a toast/title; second Esc within 1.5s actually leaves.
    this._escPrimedAt = 0;
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !this.overlay?.classList.contains('visible')) return;
      e.preventDefault();
      const now = Date.now();
      if (now - this._escPrimedAt < 1500) {
        this._escPrimedAt = 0;
        this._showEscHint(false);
        this.onLeavePort?.();
      } else {
        this._escPrimedAt = now;
        this._showEscHint(true);
        setTimeout(() => {
          if (Date.now() - this._escPrimedAt >= 1500) this._showEscHint(false);
        }, 1600);
      }
    });
  }

  /** Toggle the "Press Esc again to leave" hint on the Leave Port button. */
  _showEscHint(on) {
    const btn = this.overlay?.querySelector('.port-close-btn');
    if (!btn) return;
    if (on) {
      if (!btn.dataset.origText) btn.dataset.origText = btn.textContent;
      btn.textContent = 'Press Esc again to leave';
      btn.classList.add('esc-primed');
    } else {
      if (btn.dataset.origText) btn.textContent = btn.dataset.origText;
      btn.classList.remove('esc-primed');
    }
  }

  _setTab(tab) {
    this._activeTab = tab;
    // Port_Improvements.md §4.2: persist on PortScene so the active tab survives
    // closing the overlay and re-entering port within the same session.
    this._lastPortScene?.setActiveTab?.(tab);
    this.overlay?.querySelectorAll('[data-port-tab]').forEach(el => el.classList.remove('active'));
    this.overlay?.querySelector(`[data-port-tab="${tab}"]`)?.classList.add('active');
    this.overlay?.querySelectorAll('.port-panel').forEach(el => el.classList.remove('active'));
    this.overlay?.querySelector(`.port-panel[data-panel="${tab}"]`)?.classList.add('active');
  }

  _onHire() {
    if (this.onHireCrew) this.onHireCrew();
  }

  // _onAssignStation removed — full roster (with station selects) now lives in
  // the standalone CrewUI overlay. (Port_Improvements.md §5.5)

  /** Format upgrade stat deltas for display (C.8). */
  _formatUpgradeStats(upgrade) {
    const parts = [];
    if (upgrade.hullMax != null) parts.push(`Hull +${upgrade.hullMax}`);
    if (upgrade.sailMax != null) parts.push(`Sails +${upgrade.sailMax}`);
    if (upgrade.maxSpeedMult != null) {
      const pct = Math.round((upgrade.maxSpeedMult - 1) * 100);
      parts.push(`Speed ${pct >= 0 ? '+' : ''}${pct}%`);
    }
    if (upgrade.sailSpeedMult != null) {
      const pct = Math.round((upgrade.sailSpeedMult - 1) * 100);
      parts.push(`Sail speed +${pct}%`);
    }
    if (upgrade.cannonDamageMult != null) {
      const pct = Math.round((upgrade.cannonDamageMult - 1) * 100);
      parts.push(`Cannon dmg +${pct}%`);
    }
    if (upgrade.cannonCooldownMult != null) {
      const pct = Math.round((1 - upgrade.cannonCooldownMult) * 100);
      parts.push(`Reload +${pct}%`);
    }
    if (upgrade.cargoCapacity != null) parts.push(`Cargo +${upgrade.cargoCapacity}`);
    if (upgrade.bilgeWaterMax != null) parts.push(`Bilge +${upgrade.bilgeWaterMax}`);
    if (upgrade.turnRateMult != null) {
      const pct = Math.round((upgrade.turnRateMult - 1) * 100);
      parts.push(`Turn +${pct}%`);
    }
    if (upgrade.crewMult != null) {
      const pct = Math.round((upgrade.crewMult - 1) * 100);
      parts.push(`Crew +${pct}%`);
    }
    return parts.join(' · ') || '—';
  }

  show(portScene) {
    if (!this.overlay) return;
    this.overlay.classList.add('visible');
    this.update(portScene);
  }

  hide() {
    this.overlay?.classList.remove('visible');
  }

  isVisible() {
    return this.overlay?.classList.contains('visible') ?? false;
  }

  update(portScene) {
    if (!this.overlay || !portScene) return;
    // Port_Improvements.md §4.2: remember the active port scene so _setTab can persist tab state.
    this._lastPortScene = portScene;

    const island = portScene.getCurrentIsland();
    const roster = portScene.getCrewRoster();
    const gold = portScene.getGold();
    const shipClassId = portScene.getShipClassId?.() ?? null;
    const hireCost = CREW.hireCost ?? 25;
    const maxCrew = portScene.getMaxCrew?.() ?? CREW.maxCrew ?? 20;
    const fillInfo = getStationFillInfo(roster, shipClassId);

    const titleEl = this.overlay.querySelector('.port-title');
    if (titleEl) titleEl.textContent = `${island?.name ?? 'Port'} — ${island?.portType ?? 'harbor'}`;

    const dockFeeEl = this.overlay.querySelector('#port-dock-fee');
    const dockFeePaid = portScene.dockFeePaid ?? 0;
    if (dockFeeEl) dockFeeEl.textContent = dockFeePaid > 0 ? `(Dock fee: ${dockFeePaid} gold)` : '';

    const goldEl = this.overlay.querySelector('.port-gold');
    if (goldEl) goldEl.textContent = `${gold} gold`;
    const infamy = portScene.infamy ?? 0;
    const infamyEl = this.overlay.querySelector('#port-infamy');
    if (infamyEl) infamyEl.textContent = `${Math.floor(infamy)} Infamy`;

    // Port_Improvements.md §3.3: persistent status strip
    this._updateStatusStrip(portScene, roster);

    const hireBtn = this.overlay.querySelector('.port-hire-btn');
    if (hireBtn) {
      hireBtn.disabled = gold < hireCost || (roster?.length ?? 0) >= maxCrew;
      hireBtn.textContent = `Hire Crew (${hireCost} gold)`;
    }

    // Crew management: crew count
    const crewCountEl = this.overlay.querySelector('#port-crew-count');
    const crewMaxEl = this.overlay.querySelector('#port-crew-max');
    if (crewCountEl) crewCountEl.textContent = roster?.length ?? 0;
    if (crewMaxEl) crewMaxEl.textContent = maxCrew;

    // C.6: Morale and Serve Rum
    const moraleEl = this.overlay.querySelector('#port-morale-value');
    const rumGoodId = CREW.rumGoodId ?? 'rum';
    const rumQty = portScene.getCargo?.()?.[rumGoodId] ?? 0;
    const avgMorale = getAverageMorale(roster);
    if (moraleEl) moraleEl.textContent = roster?.length ? `${Math.round(avgMorale * 100)}%` : '—';
    const serveRumBtn = this.overlay.querySelector('#port-serve-rum');
    if (serveRumBtn) {
      serveRumBtn.disabled = rumQty < 1 || !roster?.length;
      serveRumBtn.textContent = `Serve Rum (1) — ${rumQty} in cargo`;
    }

    // Crew management: station overview
    const stationOverviewEl = this.overlay.querySelector('#port-station-overview');
    if (stationOverviewEl) {
      const stations = CREW.stations ?? [];
      stationOverviewEl.innerHTML = stations.map(s => {
        const info = fillInfo[s];
        const filled = info?.filled ?? 0;
        const slots = info?.slots ?? 1;
        const isFilled = filled >= slots;
        const isEmpty = filled === 0;
        const chipClass = isFilled ? 'filled' : (isEmpty ? 'empty' : '');
        return `<span class="port-station-chip ${chipClass}" title="${STATION_NAMES[s] ?? s}">${STATION_NAMES[s] ?? s}: ${filled}/${slots}</span>`;
      }).join('');
    }

    // Port_Improvements.md §5.5: the full roster lives in the standalone CrewUI
    // overlay. The Tavern tab now shows the summary (crew count + morale +
    // station chips) and a "Manage Crew" button. Nothing more to render here.

    const shipClassSelect = this.overlay?.querySelector('#port-ship-class-select');
    if (shipClassSelect && SHIP_CLASSES) {
      const current = shipClassId ?? 'sloop';
      const unlockedClasses = portScene.unlockedShipClasses ?? ['sloop'];
      const brigantineUnlock = INFAMY?.brigantineUnlock ?? 3;
      const galleonUnlock = INFAMY?.galleonUnlock ?? 5;
      const brigantineCost = INFAMY?.brigantineCost ?? 500;
      const galleonCost = INFAMY?.galleonCost ?? 1200;
      const hasInfamyFor = (id) => {
        if (id === 'sloop') return true;
        if (id === 'brigantine') return infamy >= brigantineUnlock;
        if (id === 'galleon') return infamy >= galleonUnlock;
        return true;
      };
      const isPurchased = (id) => unlockedClasses.includes(id);
      const canAfford = (id) => {
        if (id === 'brigantine') return gold >= brigantineCost;
        if (id === 'galleon') return gold >= galleonCost;
        return true;
      };
      const getLabel = (id, cls) => {
        if (id === 'sloop') return cls?.name ?? id;
        if (id === 'brigantine') {
          if (!hasInfamyFor(id)) return `${cls?.name ?? id} (Locked — Infamy ${brigantineUnlock})`;
          if (!isPurchased(id)) return `${cls?.name ?? id} — ${brigantineCost} gold`;
          return cls?.name ?? id;
        }
        if (id === 'galleon') {
          if (!hasInfamyFor(id)) return `${cls?.name ?? id} (Locked — Infamy ${galleonUnlock})`;
          if (!isPurchased(id)) return `${cls?.name ?? id} — ${galleonCost} gold`;
          return cls?.name ?? id;
        }
        return cls?.name ?? id;
      };
      const isSelectable = (id) => {
        if (id === 'sloop') return true;
        if (!hasInfamyFor(id)) return false;
        if (isPurchased(id)) return true;
        return canAfford(id);
      };
      shipClassSelect.innerHTML = Object.entries(SHIP_CLASSES).map(([id, cls]) => {
        const selectable = isSelectable(id);
        const sel = current === id ? ' selected' : '';
        const dis = !selectable ? ' disabled' : '';
        return `<option value="${id}"${sel}${dis}>${getLabel(id, cls)}</option>`;
      }).join('');
    }

    // Upgrades (C.8)
    const upgradesEl = this.overlay?.querySelector('#port-upgrades');
    if (upgradesEl && UPGRADES && UPGRADE_SLOTS) {
      const equipped = portScene.getUpgrades?.() ?? {};
      const slotLabels = { hull: 'Hull', sails: 'Sails', cannons: 'Cannons', cargo: 'Cargo', utility: 'Utility', boarding: 'Boarding' };
      // Port_Improvements.md §3.5: collapse each slot to "equipped + Browse"
      // expander. Expansion state lives on the slot's <details> element.
      this._expandedSlots = this._expandedSlots ?? new Set();
      upgradesEl.innerHTML = UPGRADE_SLOTS.map(slot => {
        const equippedId = equipped[slot];
        const equippedUp = equippedId ? UPGRADES[equippedId] : null;
        const available = Object.values(UPGRADES).filter(u => u.slot === slot);
        const slotLabel = slotLabels[slot] ?? slot;
        const equippedLabel = equippedUp ? `${equippedUp.name}` : '<em class="port-upgrade-empty">(empty)</em>';
        const openAttr = this._expandedSlots.has(slot) ? ' open' : '';
        const itemsHtml = available.map(u => {
          const isEquipped = u.id === equippedId;
          const canBuy = !equippedId && gold >= (u.cost ?? 0);
          const statsText = this._formatUpgradeStats(u);
          return `
            <div class="port-upgrade-item" data-upgrade-id="${esc(u.id)}">
              <span class="port-upgrade-name">${esc(u.name)}</span>
              <span class="port-upgrade-stats">${esc(statsText)}</span>
              <span class="port-upgrade-cost">${u.cost ?? 0} gold</span>
              <button type="button" class="port-upgrade-buy" data-upgrade-id="${esc(u.id)}" ${isEquipped || !canBuy ? 'disabled' : ''}>${isEquipped ? 'Equipped' : 'Buy'}</button>
            </div>
          `;
        }).join('');
        return `
          <details class="port-upgrade-slot" data-slot="${esc(slot)}"${openAttr}>
            <summary class="port-upgrade-summary">
              <span class="port-upgrade-slot-title">${esc(slotLabel)}</span>
              <span class="port-upgrade-equipped-name">${equippedLabel}</span>
              <span class="port-upgrade-browse-hint">${equippedUp ? 'Installed' : 'Browse'}</span>
            </summary>
            <div class="port-upgrade-items">${itemsHtml}</div>
          </details>
        `;
      }).join('');
      // Track open/close so a re-render preserves expansion state
      upgradesEl.querySelectorAll('details.port-upgrade-slot').forEach(el => {
        el.addEventListener('toggle', () => {
          const slot = el.dataset.slot;
          if (!slot) return;
          if (el.open) this._expandedSlots.add(slot);
          else this._expandedSlots.delete(slot);
        });
      });
      upgradesEl.querySelectorAll('.port-upgrade-buy:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.upgradeId;
          if (id && this.onBuyUpgrade) this.onBuyUpgrade(id);
        });
      });
    }

    // Ship comparison table (C.10b)
    const shipComparisonEl = this.overlay?.querySelector('#port-ship-comparison');
    if (shipComparisonEl && SHIP_CLASSES) {
      const current = shipClassId ?? 'sloop';
      const classes = Object.entries(SHIP_CLASSES);
      const rows = [
        { key: 'hullMax', label: 'Hull' },
        { key: 'sailMax', label: 'Sails' },
        { key: 'crewMax', label: 'Crew' },
        { key: 'cargoCapacity', label: 'Cargo' },
        { key: 'cannonCount', label: 'Cannons' },
        { key: 'turnRate', label: 'Turn rate' },
        { key: 'maxSpeed', label: 'Combat speed' },
      ];
      const slotCount = (cls) => Object.values(cls?.stationSlots ?? {}).reduce((a, b) => a + b, 0);
      shipComparisonEl.innerHTML = `
        <table>
          <thead><tr><th>Stat</th>${classes.map(([id, cls]) => `<th class="${id === current ? 'ship-current' : ''}">${cls?.name ?? id}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map(r => `<tr><th>${r.label}</th>${classes.map(([id, cls]) => `<td class="${id === current ? 'ship-current' : ''}">${cls?.[r.key] ?? '—'}</td>`).join('')}</tr>`).join('')}
            <tr><th>Station slots</th>${classes.map(([id, cls]) => `<td class="${id === current ? 'ship-current' : ''}">${slotCount(cls)}</td>`).join('')}</tr>
          </tbody>
        </table>
      `;
    }

    const shipState = portScene.getShipState?.() ?? portScene.shipState;
    if (shipState) {
      const hullVal = this.overlay.querySelector('#port-hull-value');
      const sailsVal = this.overlay.querySelector('#port-sails-value');
      const leaksVal = this.overlay.querySelector('#port-leaks-value');
      const hullBtn = this.overlay.querySelector('#port-repair-hull');
      const sailsBtn = this.overlay.querySelector('#port-repair-sails');
      const leaksBtn = this.overlay.querySelector('#port-repair-leaks');
      const hullNeeded = (shipState.hullMax ?? 100) - (shipState.hull ?? shipState.hullMax);
      const sailsNeeded = (shipState.sailMax ?? 100) - (shipState.sails ?? shipState.sailMax);
      const leaksCount = Math.floor(shipState.leaks ?? 0);
      const hullPerPt = REPAIR?.hullRepairCostPerPoint ?? 0.5;
      const sailPerPt = REPAIR?.sailRepairCostPerPoint ?? 0.3;
      const leakPerOne = REPAIR?.leakRepairCostPerLeak ?? 5;
      const hullCost = hullNeeded > 0 ? Math.ceil(hullNeeded * hullPerPt) : 0;
      const sailsCost = sailsNeeded > 0 ? Math.ceil(sailsNeeded * sailPerPt) : 0;
      const leaksCost = leaksCount > 0 ? leaksCount * leakPerOne : 0;
      if (hullVal) hullVal.textContent = `${Math.round(shipState.hull ?? 0)}/${shipState.hullMax ?? 100}${hullCost > 0 ? ` (${hullCost} gold)` : ''}`;
      if (sailsVal) sailsVal.textContent = `${Math.round(shipState.sails ?? 0)}/${shipState.sailMax ?? 100}${sailsCost > 0 ? ` (${sailsCost} gold)` : ''}`;
      if (leaksVal) leaksVal.textContent = `${(shipState.leaks ?? 0).toFixed(1)}${leaksCost > 0 ? ` (${leaksCost} gold)` : ''}`;
      // Port_Improvements.md §3.6: tooltip with cost breakdown
      if (hullBtn) {
        hullBtn.disabled = hullNeeded <= 0 || gold < hullCost;
        hullBtn.title = hullNeeded > 0
          ? `${hullNeeded} hull pts × ${hullPerPt} gold = ${hullCost} gold`
          : 'Hull is fully repaired.';
      }
      if (sailsBtn) {
        sailsBtn.disabled = sailsNeeded <= 0 || gold < sailsCost;
        sailsBtn.title = sailsNeeded > 0
          ? `${sailsNeeded} sail pts × ${sailPerPt} gold = ${sailsCost} gold`
          : 'Sails are fully repaired.';
      }
      if (leaksBtn) {
        leaksBtn.disabled = leaksCount <= 0 || gold < leaksCost;
        leaksBtn.title = leaksCount > 0
          ? `${leaksCount} leak${leaksCount === 1 ? '' : 's'} × ${leakPerOne} gold = ${leaksCost} gold`
          : 'No leaks to repair.';
      }
    }

    // Market panel (B.7)
    const cargoUsed = portScene.getCargoUsed?.() ?? 0;
    const cargoCap = portScene.getCargoCapacity?.() ?? 20;
    const cargoUsedEl = this.overlay?.querySelector('#port-cargo-used');
    const cargoCapEl = this.overlay?.querySelector('#port-cargo-cap');
    if (cargoUsedEl) cargoUsedEl.textContent = cargoUsed;
    if (cargoCapEl) cargoCapEl.textContent = cargoCap;

    const marketListEl = this.overlay?.querySelector('#port-market-list');
    if (marketListEl) {
      const goods = getGoods();
      // Reuse the `island` already resolved at the top of update(); no need to
      // re-query / shadow. (Port_Improvements.md §1.3)
      const cargo = portScene.getCargo?.() ?? {};
      if (goods.length === 0) {
        marketListEl.innerHTML = '<p class="port-placeholder">Loading goods…</p>';
      } else {
        marketListEl.innerHTML = goods.map(g => {
          const goodId = g.id;
          const buyPrice = getBuyPrice(goodId, island);
          const sellPrice = getSellPrice(goodId, island);
          const qty = cargo[goodId] ?? 0;
          const unitSize = g.unitSize ?? 1;
          const canBuy = gold >= buyPrice && (cargoUsed + unitSize) <= cargoCap;
          const canSell = qty > 0;
          return `
            <div class="port-market-item" data-good-id="${goodId}">
              <span class="port-market-name">${g.name ?? goodId}</span>
              <span class="port-market-qty">×${qty}</span>
              <span class="port-market-price">Buy ${buyPrice} / Sell ${sellPrice}</span>
              <div class="port-market-btns">
                <button type="button" class="port-market-btn port-buy-btn" data-good-id="${goodId}" ${!canBuy ? 'disabled' : ''}>Buy</button>
                <button type="button" class="port-market-btn port-sell-btn" data-good-id="${goodId}" ${!canSell ? 'disabled' : ''}>Sell</button>
              </div>
            </div>
          `;
        }).join('');
        marketListEl.querySelectorAll('.port-buy-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.target.dataset.goodId;
            if (id && this.onBuyGood) this.onBuyGood(id);
          });
        });
        marketListEl.querySelectorAll('.port-sell-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.target.dataset.goodId;
            if (id && this.onSellGood) this.onSellGood(id);
          });
        });
      }
    }

    this._setTab(this._activeTab ?? portScene.getActiveTab?.() ?? 'tavern');

    // Port_Improvements.md §3.8: render the action log
    this._updateActionLog(portScene);
  }

  /** Port_Improvements.md §3.3: render the persistent stat bars above the tabs. */
  _updateStatusStrip(portScene, roster) {
    if (!this.overlay) return;
    const shipState = portScene.getShipState?.() ?? portScene.shipState;
    const hull = shipState?.hull ?? 0;
    const hullMax = shipState?.hullMax ?? 100;
    const sails = shipState?.sails ?? 0;
    const sailMax = shipState?.sailMax ?? 100;
    const hullPct = hullMax > 0 ? Math.max(0, Math.min(100, (hull / hullMax) * 100)) : 0;
    const sailsPct = sailMax > 0 ? Math.max(0, Math.min(100, (sails / sailMax) * 100)) : 0;
    const avgMorale = getAverageMorale(roster);
    const moralePct = (roster?.length ?? 0) === 0 ? 0 : Math.max(0, Math.min(100, avgMorale * 100));
    const cargoUsed = portScene.getCargoUsed?.() ?? 0;
    const cargoCap = portScene.getCargoCapacity?.() ?? 20;
    const cargoPct = cargoCap > 0 ? Math.max(0, Math.min(100, (cargoUsed / cargoCap) * 100)) : 0;

    const setBar = (fillId, textId, pct, text) => {
      const fill = this.overlay.querySelector('#' + fillId);
      const txt = this.overlay.querySelector('#' + textId);
      if (fill) fill.style.width = `${pct}%`;
      if (txt) txt.textContent = text;
    };
    setBar('port-status-hull-fill',   'port-status-hull-text',   hullPct,   `${Math.round(hull)}/${hullMax}`);
    setBar('port-status-sails-fill',  'port-status-sails-text',  sailsPct,  `${Math.round(sails)}/${sailMax}`);
    setBar('port-status-morale-fill', 'port-status-morale-text', moralePct, (roster?.length ?? 0) ? `${Math.round(moralePct)}%` : '—');
    setBar('port-status-cargo-fill',  'port-status-cargo-text',  cargoPct,  `${cargoUsed}/${cargoCap}`);
  }

  /** Port_Improvements.md §3.8: render the action log list. */
  _updateActionLog(portScene) {
    if (!this.overlay) return;
    const listEl = this.overlay.querySelector('#port-action-log-list');
    if (!listEl) return;
    const entries = portScene?.getActionLog?.() ?? [];
    if (entries.length === 0) {
      listEl.innerHTML = '<li style="color:#6a7a8a; font-style: italic;">No recent activity.</li>';
      return;
    }
    listEl.innerHTML = entries.map(e => {
      const cls = e.kind === 'gain' ? 'log-gain' : e.kind === 'loss' ? 'log-loss' : '';
      return `<li class="${cls}">${esc(e.text)}</li>`;
    }).join('');
  }
}
