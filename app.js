// ==================== APP CORE ====================
class App {
    constructor() {
        this.data = {
            integrantes: [],
            documentos: [],
            comunicados: [],
            checklist: [],
            cotizaciones: [],
            reuniones: [],
            obsPrivadas: [],
            bitacora: [],
            docsValidados: [],
            isAdmin: false,
            isEnc: false,
            editPrecios: false
        };
        this.modules = {};
    }
    
    register(name, module) {
        this.modules[name] = module;
        module.setApp(this);
    }
    
    init() {
        this.loadData();
        this.setupTabs();
        this.renderAll();
    }
    
    loadData() {
        const keys = ['integrantes', 'documentos', 'comunicados', 'docsValidados', 'obsPrivadas', 'bitacora', 'reuniones'];
        keys.forEach(key => {
            const stored = localStorage.getItem(`collpani_${key}`);
            this.data[key] = stored ? JSON.parse(stored) : [];
        });
        
        // IMPLEMENTACIÓN DE DATOS POR DEFECTO PARA INTEGRANTES
        // Si no existían datos previos cargados en el localStorage, inicializamos los valores por defecto
        if (this.data.integrantes.length === 0) {
            this.data.integrantes = [
                { id: 1, nombre: "----------", ci: "6543210 LP", cargo: "Socio" },
                { id: 2, nombre: "----------", ci: "8765432 SC", cargo: "Socio" },
                { id: 3, nombre: "----------", ci: "4321098 OR", cargo: "Socio" },
                { id: 4, nombre: "----------", ci: "1234567 CB", cargo: "Socio" },
                { id: 5, nombre: "----------", ci: "7654321 PT", cargo: "Socio" },
                { id: 6, nombre: "----------", ci: "7654321 PT", cargo: "Socio" }
            ];
        }
        
        const storedChecklist = localStorage.getItem('collpani_checklist');
        if (storedChecklist) {
            this.data.checklist = JSON.parse(storedChecklist);
        } else {
            this.data.checklist = [
                { id: 1, label: "--------------------", completed: false },
                { id: 2, label: "--------------------", completed: false },
                { id: 3, label: "--------------------", completed: false },
                { id: 4, label: "--------------------", completed: false },
                { id: 5, label: "--------------------", completed: false },
                { id: 6, label: "--------------------", completed: false },
                { id: 7, label: "--------------------", completed: false },
                { id: 8, label: "--------------------", completed: false }
            ];
        }
        
        const storedCotizaciones = localStorage.getItem('collpani_cotizaciones');
        if (storedCotizaciones) {
            this.data.cotizaciones = JSON.parse(storedCotizaciones);
        } else {
            this.data.cotizaciones = [
                { id: 1, mineral: "-----", precio: 2950, moneda: "US$/TM" },
                { id: 2, mineral: "Plomo (Pb)", precio: 2150, moneda: "US$/TM" },
                { id: 3, mineral: "Plata (Ag)", precio: 24.50, moneda: "US$/oz" },
                { id: 4, mineral: "Estaño (Sn)", precio: 28900, moneda: "US$/TM" },
                { id: 5, mineral: "Oro (Au)", precio: 2350, moneda: "US$/oz" },
                { id: 6, mineral: "Cobre (Cu)", precio: 9200, moneda: "US$/TM" },
                { id: 7, mineral: "Wolfran (W)", precio: 9200, moneda: "US$/TM" },
                { id: 8, mineral: "Antimonio (SB)", precio: 8888, moneda: "US$/TM" }
            ];
        }
    }
    
    save() {
        const keys = ['integrantes', 'documentos', 'comunicados', 'checklist', 'cotizaciones', 'reuniones', 'obsPrivadas', 'bitacora', 'docsValidados'];
        keys.forEach(key => {
            localStorage.setItem(`collpani_${key}`, JSON.stringify(this.data[key]));
        });
    }
    
    bitacora(accion, detalle) {
        this.data.bitacora.unshift({
            id: Date.now(),
            fecha: new Date().toLocaleString(),
            accion: accion,
            detalle: detalle
        });
        if (this.data.bitacora.length > 100) this.data.bitacora.pop();
        this.save();
    }
    
    renderAll() {
        Object.keys(this.modules).forEach(key => {
            if (this.modules[key] && typeof this.modules[key].render === 'function') {
                this.modules[key].render();
            }
        });
    }
    
    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const panes = document.querySelectorAll('.tab-pane');
        
        tabs.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = btn.getAttribute('data-tab');
                tabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                panes.forEach(pane => pane.classList.remove('active-pane'));
                const activePane = document.getElementById(tabId);
                if (activePane) activePane.classList.add('active-pane');
                
                const moduleName = this.getModuleNameFromTab(tabId);
                if (moduleName && this.modules[moduleName] && typeof this.modules[moduleName].onShow === 'function') {
                    this.modules[moduleName].onShow();
                }
            });
        });
    }
    
    getModuleNameFromTab(tabId) {
        const map = {
            'tab1': 'socios', 'tab2': 'documentos', 'tab3': 'avance',
            'tab4': 'checklist', 'tab5': 'cotizaciones', 'tab6': 'reuniones', 'tab7': 'encargados'
        };
        return map[tabId];
    }
    
    showAdminModal() {
        const existingModal = document.querySelector('.modal');
        if (existingModal) existingModal.remove();
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Acceso Administrador</h3>
                <input type="password" id="admPwd" placeholder="Escribe la contraseña maestra" style="width:100%; margin:1rem 0; padding:0.5rem; color: #000;">
                <button id="admBtn" class="success" style="width:100%; margin-bottom:0.5rem;">Ingresar</button>
                <button id="admClose" class="secondary" style="width:100%;">Cerrar</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('#admBtn').onclick = () => {
            const pwd = modal.querySelector('#admPwd').value.trim();
            if (btoa(pwd) === "YWRtaW4xMjM=") {
                this.data.isAdmin = true;
                this.renderAll();
                modal.remove();
            } else {
                alert('Contraseña incorrecta.');
            }
        };
        modal.querySelector('#admClose').onclick = () => modal.remove();
    }
    
    escape(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
    }
    
    puedeEditar() {
        return this.data.isAdmin || this.data.isEnc;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    
    if (typeof SociosModule !== 'undefined') window.app.register('socios', SociosModule);
    if (typeof DocumentosModule !== 'undefined') window.app.register('documentos', DocumentosModule);
    if (typeof AvanceModule !== 'undefined') window.app.register('avance', AvanceModule);
    if (typeof ChecklistModule !== 'undefined') window.app.register('checklist', ChecklistModule);
    if (typeof CotizacionesModule !== 'undefined') window.app.register('cotizaciones', CotizacionesModule);
    if (typeof ReunionesModule !== 'undefined') window.app.register('reuniones', ReunionesModule);
    if (typeof EncargadosModule !== 'undefined') window.app.register('encargados', EncargadosModule);
    
    window.app.init();
});