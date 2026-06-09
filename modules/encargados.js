// Módulo: Panel privado de encargados
const EncargadosModule = (function() {
    let app = null;
    
    return {
        setApp: (instance) => { 
            app = instance; 
        },
        
        render: () => {
            const container = document.getElementById('encargadosContent');
            if (!container) return;
            
            // Siempre mostrar el contenido según el estado de autenticación
            if (!app.data.isEnc) {
                container.innerHTML = EncargadosModule.loginForm();
                const loginBtn = document.getElementById('loginEncBtn');
                if (loginBtn) {
                    // Remover eventos anteriores para evitar duplicados
                    const newBtn = loginBtn.cloneNode(true);
                    loginBtn.parentNode.replaceChild(newBtn, loginBtn);
                    newBtn.addEventListener('click', () => EncargadosModule.login());
                }
            } else {
                container.innerHTML = EncargadosModule.panelContent();
                EncargadosModule.attachEvents();
            }
        },
        
        loginForm: () => `
            <div class="card" style="text-align: center; max-width: 400px; margin: 0 auto;">
                <i class="fas fa-lock" style="font-size: 3rem; color: #7c3aed;"></i>
                <h3 style="margin: 0.5rem 0;">Área de Encargados del Trámite</h3>
                <p>Ingrese la contraseña para acceder a las funciones de gestión</p>
                <input type="password" id="encPwd" placeholder="Contraseña" style="width:100%; margin: 1rem 0; padding:0.5rem; border-radius:30px;">
                <button id="loginEncBtn" style="background:#7c3aed; width:100%; padding:0.5rem; border-radius:30px; border:none; color:white; cursor:pointer;">Acceder al panel</button>
                <p style="font-size: 0.7rem; margin-top: 0.8rem;">Primera vez: use <strong>"tramite2026"</strong> o cree una nueva</p>
            </div>
        `,
        
        login: () => {
            const pwdInput = document.getElementById('encPwd');
            if (!pwdInput) return;
            
            const pwd = pwdInput.value;
            
            if (!app.data.encHash) {
                // Primera vez - crear contraseña
                if (pwd.length >= 4) {
                    app.data.encHash = btoa(pwd);
                    localStorage.setItem('collpani_enc_hash', app.data.encHash);
                    app.data.isEnc = true;
                    app.bitacora("ENCARGADOS", "Creó acceso y entró al panel");
                    // Forzar re-render
                    app.renderAll();
                } else {
                    alert('La contraseña debe tener al menos 4 caracteres');
                }
            } else {
                // Verificar contraseña existente
                if (btoa(pwd) === app.data.encHash) {
                    app.data.isEnc = true;
                    app.bitacora("ENCARGADOS", "Inició sesión");
                    // Forzar re-render
                    app.renderAll();
                } else {
                    alert('Contraseña incorrecta');
                }
            }
        },
        
        panelContent: () => {
            const completados = app.data.checklist.filter(c => c.completed).length;
            return `
                <div class="card" style="background: linear-gradient(135deg, #f3e8ff, #faf5ff); border: 2px solid #7c3aed;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                        <h2><i class="fas fa-user-shield"></i> Panel de Encargados</h2>
                        <button id="logoutEncBtn" class="warning" style="background:#d97706; border:none; padding:0.4rem 1rem; border-radius:30px; cursor:pointer; color:white;">Cerrar sesión</button>
                    </div>
                </div>
                
                <div class="grid-2">
                    <div class="card">
                        <h3><i class="fas fa-check-circle"></i> Validar Documentos</h3>
                        <p style="font-size:0.75rem; color:#64748b;">Marque los documentos que han sido verificados</p>
                        <div id="validarDocsLista" style="margin-top: 0.5rem;"></div>
                    </div>
                    <div class="card">
                        <h3><i class="fas fa-chart-line"></i> Resumen del Trámite</h3>
                        <p><strong>Socios:</strong> ${app.data.integrantes.length}/20</p>
                        <p><strong>Requisitos cumplidos:</strong> ${completados}/${app.data.checklist.length}</p>
                        <p><strong>Documentos subidos:</strong> ${app.data.documentos.length}</p>
                        <p><strong>Documentos validados:</strong> ${app.data.docsValidados.length}</p>
                        <button id="generarReporteBtn" class="btn-small success" style="margin-top: 0.5rem; background:#2b7e5a; border:none; padding:0.3rem 1rem; border-radius:30px; cursor:pointer; color:white;">📊 Generar reporte</button>
                    </div>
                </div>
                
                <div class="card">
                    <h3><i class="fas fa-comments"></i> Observaciones Internas</h3>
                    <textarea id="nuevaObs" rows="2" placeholder="Nota privada para los encargados..." style="width:100%; padding:0.5rem; border-radius:16px; border:1px solid #cbd5e1;"></textarea>
                    <button id="addObsBtn" style="margin-top: 0.5rem; background:#1a5e52; border:none; padding:0.3rem 1rem; border-radius:30px; cursor:pointer; color:white;">+ Agregar observación</button>
                    <div id="obsLista" style="margin-top: 1rem;"></div>
                </div>
                
                <div class="card">
                    <h3><i class="fas fa-history"></i> Bitácora de Actividades</h3>
                    <div id="bitacoraLista" style="max-height: 300px; overflow-y: auto;"></div>
                </div>
            `;
        },
        
        attachEvents: () => {
            // Validar documentos
            const validDiv = document.getElementById('validarDocsLista');
            if (validDiv) {
                if (app.data.documentos.length === 0) {
                    validDiv.innerHTML = '<p style="color:#64748b;">No hay documentos para validar</p>';
                } else {
                    validDiv.innerHTML = app.data.documentos.map(d => `
                        <div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" class="valDoc" data-id="${d.id}" ${app.data.docsValidados.includes(d.id) ? 'checked' : ''} style="width: 18px; height: 18px;">
                            <span>${app.escape(d.name)}</span>
                        </div>
                    `).join('');
                    
                    document.querySelectorAll('.valDoc').forEach(cb => {
                        cb.addEventListener('change', (e) => {
                            const id = parseInt(e.target.getAttribute('data-id'));
                            if (e.target.checked) {
                                if (!app.data.docsValidados.includes(id)) {
                                    app.data.docsValidados.push(id);
                                }
                            } else {
                                app.data.docsValidados = app.data.docsValidados.filter(v => v !== id);
                            }
                            app.save();
                            app.bitacora("VALIDACIÓN", `Documento ${e.target.checked ? 'validado' : 'desvalidado'}`);
                            // Actualizar solo la lista de documentos en la pestaña principal
                            if (window.app.modules.documentos) {
                                window.app.modules.documentos.render();
                            }
                        });
                    });
                }
            }
            
            // Observaciones
            const addObsBtn = document.getElementById('addObsBtn');
            if (addObsBtn) {
                // Remover eventos anteriores
                const newBtn = addObsBtn.cloneNode(true);
                addObsBtn.parentNode.replaceChild(newBtn, addObsBtn);
                newBtn.addEventListener('click', () => {
                    const texto = document.getElementById('nuevaObs').value;
                    if (texto.trim()) {
                        app.data.obsPrivadas.push({
                            id: Date.now(),
                            texto: texto,
                            fecha: new Date().toISOString()
                        });
                        app.save();
                        app.bitacora("OBSERVACIÓN", texto.substring(0, 50));
                        // Recargar solo este módulo
                        EncargadosModule.render();
                    }
                });
            }
            
            // Mostrar observaciones
            const obsLista = document.getElementById('obsLista');
            if (obsLista) {
                if (app.data.obsPrivadas.length === 0) {
                    obsLista.innerHTML = '<p style="color:#64748b;">No hay observaciones internas</p>';
                } else {
                    obsLista.innerHTML = app.data.obsPrivadas.map(o => `
                        <div class="card" style="margin: 8px 0; padding: 0.5rem;">
                            <small style="color:#64748b;">${new Date(o.fecha).toLocaleString()}</small>
                            <p style="margin-top: 4px;">📌 ${app.escape(o.texto)}</p>
                            <button class="btn-small danger" onclick="window.app.modules.encargados.eliminarObs(${o.id})" style="background:#b91c1c; border:none; padding:0.2rem 0.8rem; border-radius:20px; cursor:pointer; color:white; font-size:0.7rem;">Eliminar</button>
                        </div>
                    `).join('');
                }
            }
            
            // Bitácora
            const bitacoraLista = document.getElementById('bitacoraLista');
            if (bitacoraLista) {
                if (app.data.bitacora.length === 0) {
                    bitacoraLista.innerHTML = '<p style="color:#64748b;">No hay actividades registradas</p>';
                } else {
                    bitacoraLista.innerHTML = app.data.bitacora.map(b => `
                        <div style="font-size: 0.75rem; padding: 5px 0; border-bottom: 1px solid #e2e8f0;">
                            <small style="color:#64748b;">${b.fecha}</small> 
                            <strong>${b.accion}</strong>: ${app.escape(b.detalle)}
                        </div>
                    `).join('');
                }
            }
            
            // Reporte
            const reporteBtn = document.getElementById('generarReporteBtn');
            if (reporteBtn) {
                const newBtn = reporteBtn.cloneNode(true);
                reporteBtn.parentNode.replaceChild(newBtn, reporteBtn);
                newBtn.addEventListener('click', () => {
                    const completados = app.data.checklist.filter(c => c.completed).length;
                    const reporte = `=== REPORTE COLLPANI ===\nFecha: ${new Date().toLocaleString()}\nSocios: ${app.data.integrantes.length}/20\nRequisitos: ${completados}/${app.data.checklist.length}\nDocumentos: ${app.data.documentos.length}\nValidados: ${app.data.docsValidados.length}\nReuniones: ${app.data.reuniones.length}\nObservaciones: ${app.data.obsPrivadas.length}`;
                    alert(reporte);
                    app.bitacora("REPORTE", "Generó reporte del trámite");
                });
            }
            
            // Logout
            const logoutBtn = document.getElementById('logoutEncBtn');
            if (logoutBtn) {
                const newBtn = logoutBtn.cloneNode(true);
                logoutBtn.parentNode.replaceChild(newBtn, logoutBtn);
                newBtn.addEventListener('click', () => {
                    app.data.isEnc = false;
                    app.data.editPrecios = false;
                    app.bitacora("ENCARGADOS", "Cerró sesión");
                    app.renderAll();
                });
            }
        },
        
        eliminarObs: (id) => {
            if (confirm('¿Eliminar esta observación?')) {
                app.data.obsPrivadas = app.data.obsPrivadas.filter(o => o.id !== id);
                app.save();
                app.bitacora("ELIMINAR", `Observación ID: ${id}`);
                EncargadosModule.render();
            }
        }
    };
})();
