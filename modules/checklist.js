// ==================== MÓDULO: CHECKLIST DE REQUISITOS ====================
(function() {
    let app = null;
    const ChecklistModule = {
        setApp: (instance) => { app = instance; },
        
        render: () => {
            const container = document.getElementById('checklistContent');
            if (!container) return;
            
            const data = app.data;
            const checklistData = data.checklist || [];
            
            // Cálculos para la barra de progreso
            const totalItems = checklistData.length;
            const completedItems = checklistData.filter(item => item.completed).length;
            const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

            const html = `
                <div class="flex-between" style="margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h2 style="margin: 0; font-size: 1.5rem; color: #fff; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-check-double" style="color: #10b981;"></i> Requisitos Personería Jurídica
                        </h2>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #94a3b8;">Monitoreo y validación de documentación legal</p>
                    </div>
                    <button id="adminModeBtn" class="js-admin-btn" style="
                        background: ${data.isAdmin ? '#ef4444' : '#1a5e52'}; 
                        color: white; 
                        border: none; 
                        padding: 0.6rem 1.2rem; 
                        border-radius: 8px; 
                        font-weight: 600; 
                        cursor: pointer; 
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    ">
                        ${data.isAdmin ? '<i class="fas fa-lock-open"></i> Salir Modo Admin' : '<i class="fas fa-key"></i> Modificar Checklist'}
                    </button>
                </div>

                <div style="background: #1e293b; padding: 1.25rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); margin-bottom: 1.5rem; border: 1px solid #334155;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #cbd5e1;">
                        <span>Progreso de la Gestión</span>
                        <span style="color: #10b981;">${completedItems} de ${totalItems} (${progressPercent}%)</span>
                    </div>
                    <div style="width: 100%; background: #334155; height: 10px; border-radius: 9999px; overflow: hidden;">
                        <div style="width: ${progressPercent}%; background: linear-gradient(90deg, #10b981, #059669); height: 100%; transition: width 0.4s ease;"></div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    ${checklistData.length > 0 ? checklistData.map(item => {
                        const bgStyle = item.completed ? 'background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.3);' : 'background: #1e293b; border-color: #334155;';
                        const textStyle = item.completed ? 'color: #a7f3d0; text-decoration: line-through; opacity: 0.7;' : 'color: #e2e8f0;';
                        
                        return `
                            <div class="checklist-item-card" style="
                                ${bgStyle}
                                border-width: 1px;
                                border-style: solid;
                                padding: 1rem;
                                border-radius: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                gap: 1rem;
                                transition: transform 0.2s ease, box-shadow 0.2s ease;
                            ">
                                <div style="display: flex; align-items: center; gap: 1rem; flex: 1;">
                                    <label style="position: relative; display: flex; align-items: center; cursor: ${data.isAdmin ? 'pointer' : 'not-allowed'};">
                                        <input type="checkbox" data-id="${item.id}" ${item.completed ? 'checked' : ''} ${!data.isAdmin ? 'disabled' : ''} 
                                        style="
                                            width: 1.25rem; 
                                            height: 1.25rem; 
                                            accent-color: #10b981; 
                                            cursor: ${data.isAdmin ? 'pointer' : 'not-allowed'};
                                        ">
                                    </label>
                                    <span style="${textStyle} font-size: 0.95rem; line-height: 1.4;">
                                        ${app.escape(item.label)}
                                    </span>
                                </div>
                                
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    ${item.completed 
                                        ? '<span style="background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">Completado</span>' 
                                        : '<span style="background: #334155; color: #94a3b8; padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">Pendiente</span>'
                                    }
                                    ${!data.isAdmin ? '<i class="fas fa-lock" style="color: #64748b; font-size: 0.85rem;" title="Solo lectura"></i>' : ''}
                                </div>
                            </div>
                        `;
                    }).join('') : '<p style="text-align:center; color:#94a3b8;">No hay requisitos cargados.</p>'}
                </div>

                ${!data.isAdmin ? `
                    <div style="margin-top: 1.25rem; display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: #0f172a; border-radius: 8px; border: 1px dashed #334155;">
                        <i class="fas fa-info-circle" style="color: #64748b;"></i>
                        <p style="margin: 0; font-size: 0.8rem; color: #94a3b8;">Modo de visualización. Autentíquese como administrador para registrar cambios en los requisitos.</p>
                    </div>
                ` : ''}
            `;
            
            container.innerHTML = html;
            
            if (!document.getElementById('checklist-dynamic-styles')) {
                const style = document.createElement('style');
                style.id = 'checklist-dynamic-styles';
                style.innerHTML = `
                    .checklist-item-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
                    #adminModeBtn:hover { filter: brightness(1.1); }
                `;
                document.head.appendChild(style);
            }
            
            // Eventos para los Checkboxes
            if (data.isAdmin) {
                container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    cb.addEventListener('change', (e) => {
                        const id = parseInt(e.target.dataset.id);
                        const item = data.checklist.find(i => i.id === id);
                        if (item) {
                            item.completed = e.target.checked;
                            app.save(); 
                            app.bitacora("CHECKLIST", `${item.label} → ${item.completed ? 'Completado' : 'Pendiente'}`);
                            app.renderAll(); 
                        }
                    });
                });
            }
            
            // SOLUCIÓN AL ERROR 1 y 2: Delegación directa al contenedor sin usar "this" confuso
            const btn = container.querySelector('.js-admin-btn');
            if (btn) {
                btn.onclick = () => {
                    ChecklistModule.toggleAdmin();
                };
            }
        },
        toggleAdmin: () => {
            if (app.data.isAdmin) {
                if (confirm('¿Salir del modo administrador?')) {
                    app.data.isAdmin = false;
                    app.renderAll();
                }
            } else {
                // Forzar la llamada directa al objeto global app
                if (app.data.adminHash) {
                    app.showAdminModal(false);
                } else {
                    app.showAdminModal(true);
                }
            }
        }
    };
    window.ChecklistModule = ChecklistModule;
})();