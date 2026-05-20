import { db } from './firebase-config.js';
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);

document.addEventListener('DOMContentLoaded', () => {
    const el = {
        overlay: $('#modal-overlay'), close: $('#close-modal'), name: $('#punto-nombre'),
        searchBtn: $('#searchTrigger'), searchInp: $('#manualSearch'),
        mobSearchBtn: $('#toggleMobileSearch'), mobSearchRow: $('#mobileSearchRow'), mobSearchInp: $('#mobileSearchInput'),
        mobActionBtn: $('#mobileSearchAction')
    };

    const updatePanel = item => {
        const d = window.mapData[item.dataset.id];
        if (!d) return;
        if (el.name) el.name.textContent = d.nombre || d.id;
        
        if (d.estatus === false) {
            el.overlay?.classList.add('modal-desactivada');
        } else {
            el.overlay?.classList.remove('modal-desactivada');
            const h = $('#punto-horario'), p = $('#punto-programacion');
            if (h) h.textContent = d.horario || "12:00 - 00:00";
            if (p) p.innerHTML = d.eventos?.length ? d.eventos.map(e => `<div class="evento-item"><span class="evento-hora">${e.hora}</span><span class="evento-desc">${e.descripcion}</span></div>`).join('') : "<p>No hay eventos programados.</p>";
            
            const imgEl = $('#punto-imagen');
            if (imgEl) {
                if (d.imagen && d.imagen.trim() !== '') {
                    imgEl.src = d.imagen;
                    imgEl.style.display = 'block';
                } else {
                    imgEl.src = '';
                    imgEl.style.display = 'none';
                }
            }
            
            const descEl = $('#punto-descripcion');
            if (descEl) {
                if (d.descripcion && d.descripcion.trim() !== '') {
                    descEl.textContent = d.descripcion;
                    descEl.style.display = 'block';
                } else {
                    descEl.style.display = 'none';
                }
            }
            
            const tagsEl = $('#punto-etiquetas');
            if (tagsEl) {
                let tags = [];
                if (d.etiquetas && Array.isArray(d.etiquetas)) tags.push(...d.etiquetas);
                if (d.etiqueta && typeof d.etiqueta === 'string' && d.etiqueta.trim() !== '') tags.push(d.etiqueta.trim());
                if (tags.length > 0) {
                    tagsEl.innerHTML = tags.map(t => `<span class="etiqueta-badge">${t}</span>`).join('');
                    tagsEl.style.display = 'flex';
                } else {
                    tagsEl.style.display = 'none';
                    tagsEl.innerHTML = '';
                }
            }
        }
        
        el.overlay?.classList.add('active');
        el.overlay?.setAttribute('aria-hidden', 'false');
    };

    el.close?.addEventListener('click', () => {
        el.overlay?.classList.remove('active');
        el.overlay?.setAttribute('aria-hidden', 'true');
    });

    const search = q => {
        $$('.mapItem').forEach(i => i.classList.remove('highlight-match'));
        if (!q?.trim()) return;
        const n = q.toLowerCase().trim();
        $$('.mapItem').forEach(i => {
            if ((i.dataset.name || '').toLowerCase().includes(n)) i.classList.add('highlight-match');
        });
    };

    [el.searchInp, el.mobSearchInp].forEach(i => {
        i?.addEventListener('input', e => search(e.target.value));
        i?.addEventListener('keypress', e => e.key === 'Enter' && search(e.target.value));
    });

    el.searchBtn?.addEventListener('click', () => search(el.searchInp.value));
    el.mobActionBtn?.addEventListener('click', () => search(el.mobSearchInp.value));

    el.mobSearchBtn?.addEventListener('click', e => {
        e.stopPropagation();
        const a = el.mobSearchRow.classList.toggle('active');
        el.mobSearchBtn.classList.toggle('active');
        el.mobSearchBtn.setAttribute('aria-expanded', a);
        el.mobSearchRow.setAttribute('aria-hidden', !a);
        if (a) setTimeout(() => el.mobSearchInp?.focus(), 100);
    });

    document.addEventListener('click', e => {
        if (el.mobSearchRow?.classList.contains('active') && !el.mobSearchRow.contains(e.target) && !el.mobSearchBtn.contains(e.target)) {
            el.mobSearchRow.classList.remove('active');
            el.mobSearchBtn.classList.remove('active');
            el.mobSearchBtn.setAttribute('aria-expanded', 'false');
            el.mobSearchRow.setAttribute('aria-hidden', 'true');
        }
    });

    el.mobSearchRow?.addEventListener('click', e => e.stopPropagation());

    const sidePanel = $('#sidePanel'), casetasList = $('#casetasList'), closePanel = $('#closeSidePanel');
    const casetasTriggers = [$('#casetasTriggerMobile'), $('#casetasTriggerDesktop')];
    
    const togglePanel = (force) => {
        const isActive = typeof force === 'boolean' ? force : !sidePanel?.classList.contains('active');
        sidePanel?.classList.toggle('active', isActive);
        sidePanel?.setAttribute('aria-hidden', !isActive);
    };

    casetasTriggers.forEach(t => t?.addEventListener('click', e => { e.stopPropagation(); togglePanel(); }));
    closePanel?.addEventListener('click', () => togglePanel(false));
    document.addEventListener('keydown', e => e.key === 'Escape' && togglePanel(false));

    const renderMenuCasetas = () => {
        if (!casetasList) return;
        const a = Object.values(window.mapData).sort((x,y) => x.id.localeCompare(y.id));
        casetasList.innerHTML = a.length ? '' : '<div class="casetas-dropdown-placeholder">Cargando casetas...</div>';
        a.forEach((c) => {
            const b = document.createElement('button');
            b.className = 'side-panel-item'; b.type = 'button';
            b.innerHTML = `<i class="fas fa-store-alt" style="margin-right:10px;"></i><span>${c.nombre || `Caseta ${parseInt(c.id.replace('p', ''))}`}</span>`;
            b.addEventListener('click', () => { 
                const p = $(`polygon[data-id="${c.id}"]`);
                if (p) {
                    $$('.mapItem').forEach(item => item.classList.remove('highlight-match'));
                    p.classList.add('highlight-match');
                }
                if (window.innerWidth <= 991) togglePanel(false);
            });
            casetasList.appendChild(b);
        });
    };

    const mapContent = $('.mapContent'), mapCont = $('.mapImageContainer');
    let pz;
    const setupPanzoom = () => {
        if (!mapContent || typeof panzoom === 'undefined') return;
        const img = mapContent.querySelector('.mapImage');
        if (img && !img.complete) return img.onload = setupPanzoom;
        if (pz) pz.dispose();
        const r = mapCont.getBoundingClientRect(), w = 930, h = 1100, sx = r.width/w, sy = r.height/h,
              z = window.innerWidth < 768 ? Math.min(sx, sy) : Math.min(sx, sy) * 0.95;
        pz = panzoom(mapContent, { maxZoom: 5, minZoom: z, bounds: true, boundsPadding: 0 });
        pz.on('transform', () => {
            const t = pz.getTransform(), s = t.scale;
            if (s < z) return pz.zoomAbs(0, 0, z);
            let nx = t.x, ny = t.y, cw = w*s, ch = h*s;
            nx = cw <= r.width ? (r.width-cw)/2 : Math.min(0, Math.max(nx, r.width-cw));
            ny = ch <= r.height ? (r.height-ch)/2 : Math.min(0, Math.max(ny, r.height-ch));
            if (nx !== t.x || ny !== t.y) pz.moveTo(nx, ny);
        });
        pz.zoomAbs(0, 0, z); pz.moveTo((r.width-w*z)/2, (r.height-h*z)/2);
    };

    const PTS = [
        { id: "p01", coords: [813,735,855,724,868,786,823,795] }, { id: "p02", coords: [723,751,811,734,823,795,735,811] },
        { id: "p03", coords: [680,760,725,750,736,811,694,820] }, { id: "p04", coords: [637,768,679,758,692,819,647,828] },
        { id: "p05", coords: [592,777,637,768,647,829,606,835] }, { id: "p06", coords: [506,793,591,776,603,836,517,852] },
        { id: "p07", coords: [757,680,843,665,855,724,767,741] }, { id: "p08", coords: [670,697,757,682,767,741,680,759] },
        { id: "p09", coords: [583,714,669,698,680,759,594,775] }, { id: "p10", coords: [494,731,581,714,594,776,507,793] },
        { id: "p11", coords: [377,817,464,801,476,863,388,877] }, { id: "p12", coords: [336,824,378,817,388,877,345,885] },
        { id: "p13", coords: [291,833,333,824,345,885,301,893] }, { id: "p14", coords: [202,849,290,834,301,893,215,910] },
        { id: "p15", coords: [115,867,201,851,214,911,126,926] }, { id: "p16", coords: [365,755,453,738,465,800,378,815] },
        { id: "p17", coords: [234,780,365,756,377,816,246,841] }, { id: "p18", coords: [191,788,234,779,248,841,203,848] },
        { id: "p19", coords: [103,805,192,788,201,848,117,865] }, { id: "p20", coords: [773,528,816,518,833,602,789,610] },
        { id: "p21", coords: [709,540,773,529,789,610,722,623] }, { id: "p22", coords: [642,554,708,541,722,623,656,636] },
        { id: "p23", coords: [598,560,642,553,655,635,613,643] }, { id: "p24", coords: [554,569,597,562,615,643,571,652] },
        { id: "p25", coords: [509,577,555,569,569,652,525,660] }, { id: "p26", coords: [468,586,510,579,524,660,482,668] },
        { id: "p27", coords: [758,445,801,437,817,520,773,528] }, { id: "p28", coords: [714,453,758,445,773,528,730,534] },
        { id: "p29", coords: [539,487,713,454,729,535,556,568] }, { id: "p30", coords: [495,493,538,486,554,570,510,577] },
        { id: "p31", coords: [452,502,495,493,511,579,469,585] }, { id: "p32", coords: [338,609,426,593,442,677,354,692] },
        { id: "p33", coords: [251,628,338,612,353,692,269,710] }, { id: "p34", coords: [207,635,253,627,268,709,225,719] },
        { id: "p35", coords: [163,643,207,635,225,718,179,726] }, { id: "p36", coords: [119,650,164,642,178,726,135,735] },
        { id: "p37", coords: [75,659,118,653,136,734,91,742] }, { id: "p38", coords: [324,527,411,509,426,592,340,608] },
        { id: "p39", coords: [279,536,323,528,338,610,295,618] }, { id: "p40", coords: [215,548,280,536,295,619,229,630] },
        { id: "p41", coords: [149,559,216,546,229,629,165,642] }, { id: "p42", coords: [105,568,150,559,165,643,120,649] },
        { id: "p43", coords: [60,576,106,569,119,650,77,658] }, { id: "p44", coords: [736,330,779,321,793,383,750,390] },
        { id: "p45", coords: [693,339,735,331,748,391,706,400] }, { id: "p46", coords: [648,348,694,337,706,401,661,409] },
        { id: "p47", coords: [561,363,650,347,661,409,573,424] }, { id: "p48", coords: [474,380,562,363,573,424,486,440] },
        { id: "p49", coords: [430,390,472,379,485,440,440,450] }, { id: "p50", coords: [682,277,769,261,782,323,693,337] },
        { id: "p51", coords: [593,294,682,276,695,339,606,356] }, { id: "p52", coords: [550,301,595,294,606,355,562,363] },
        { id: "p53", coords: [485,316,549,303,562,363,498,376] }, { id: "p54", coords: [418,327,426,363,469,356,474,380,498,375,484,314] },
        { id: "p55", coords: [426,364,431,387,474,379,469,357] }, { id: "p56", coords: [303,414,390,395,402,456,314,473] }
    ];

    window.mapData = {};
    const mapEl = $('#eventMap');
    let drag = false, sx = 0, sy = 0;
    
    if (mapCont) {
        mapCont.addEventListener('mousedown', e => { drag=false; sx=e.clientX; sy=e.clientY; }, true);
        mapCont.addEventListener('mousemove', e => { if (Math.abs(e.clientX-sx)>10 || Math.abs(e.clientY-sy)>10) drag=true; }, true);
        mapCont.addEventListener('touchstart', e => { drag=false; sx=e.touches[0].clientX; sy=e.touches[0].clientY; }, { passive: true, capture: true });
        mapCont.addEventListener('touchmove', e => { if (Math.abs(e.touches[0].clientX-sx)>10 || Math.abs(e.touches[0].clientY-sy)>10) drag=true; }, { passive: true, capture: true });
    }

    const render = () => {
        if (!mapEl) return;
        mapEl.innerHTML = ""; 
        Object.values(window.mapData).forEach(d => {
            if (!d.coords || d.coords.length < 6) return;
            const p = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            p.setAttribute("points", d.coords.reduce((a,c,i) => a + c + (i%2?',':' '), '').trim());
            p.setAttribute("class", "mapItem" + (d.estatus === false ? " caseta-desactivada" : "")); p.setAttribute("data-id", d.id);
            if (d.nombre) p.setAttribute("data-name", d.nombre);
            const t = document.createElementNS("http://www.w3.org/2000/svg", "title");
            t.textContent = d.nombre || d.id; p.appendChild(t);
            const handlePolygonClick = (e) => {
                if (drag) return;
                if (e?.type === 'touchend') e.preventDefault();
                updatePanel(p);
                p.classList.remove('highlight-match');
            };
            p.addEventListener('click', handlePolygonClick);
            p.addEventListener('touchend', handlePolygonClick);
            mapEl.appendChild(p);
        });
        renderMenuCasetas();
    };

    try {
        onSnapshot(collection(db, "feria"), sn => {
            window.mapData = {}; PTS.forEach(p => window.mapData[p.id] = { ...p });
            sn?.forEach(d => { const id=d.id; window.mapData[id] = { ...(window.mapData[id]||{}), ...d.data(), id }; });
            render();
        });
    } catch(e) {
        PTS.forEach(p => window.mapData[p.id] = { ...p }); render();
    }

    setupPanzoom(); window.addEventListener('resize', setupPanzoom);
});
