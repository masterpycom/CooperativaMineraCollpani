// Módulo: Reuniones y convocatorias - Cooperativa Minera Collpani (Premium & Interactivo)
(function() {
    let app = null;

    // Función auxiliar interna para calcular el estado del tiempo de la reunión
    const calcularTiempoRestante = (fechaString) => {
        if (!fechaString) return { texto: "📅 Fecha sin definir", clase: "status-pendiente" };
        
        const hoy = new Date();
        const fechaReunion = new Date(fechaString);
        const diferenciaTiempo = fechaReunion - hoy;
        const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

        if (diferenciaDias < 0) {
            return { texto: "✅ Convocatoria Realizada", clase: "status-aprobado" };
        } else if (diferenciaDias === 0) {
            return { texto: "🚨 ¡Es Hoy!", clase: "status-pendiente" };
        } else {
            return { texto: `⏳ Faltan ${diferenciaDias} días`, clase: "status-pendiente" };
        }
    };

    window.ReunionesModule = {
        setApp: (instance) => { app = instance; },
        
        render: () => {
            const container = document.getElementById('reunionesContent');
            if (!container) return;
            
            const { reuniones = [] } = app.data || {};
            const puedeEditar = typeof app.puedeEditar === 'function' ? app.puedeEditar() : true;
            
            if (reuniones.length === 0) {
                reuniones.push({
                    id: Date.now(),
                    titulo: "CONVOCATORIA A ASAMBLEA GENERAL EXTRAORDINARIA N° 01/2026",
                    fecha: new Date().toISOString().slice(0, 16),
                    lugar: "Sede Social de la Cooperativa Minera Collpani",
                    ordenDia: "1. Control de Asistencia.\n2. Informe del Consejo de Administración sobre el trámite de Personería Jurídica.\n3. Análisis de aportes y cuotas extraordinarias.\n4. Asuntos varios.",
                    notas: "Registrar aquí las resoluciones principales firmadas en el acta..."
                });
                app.save();
            }
            
            container.innerHTML = `
                <div class="flex-between" style="margin-bottom: 2rem;">
                    <h2 style="font-size: 1.6rem; letter-spacing: 0.5px;"><i class="fas fa-calendar-alt" style="color: #00bc8c;"></i> Panel de Convocatorias Oficiales</h2>
                    ${puedeEditar ? '<button id="nuevoRapidoBtn" class="success" style="padding: 0.75rem 1.5rem; font-weight: bold; border-radius: 6px; cursor: pointer; transition: 0.2s;">+ Emitir Nueva Convocatoria</button>' : ''}
                </div>
                
                <div id="reunionesLista">
                    ${reuniones.map(r => {
                        const tiempo = calcularTiempoRestante(r.fecha);
                        return `
                            <div class="reunion-card" data-id="${r.id}" style="border-top: 4px solid #00bc8c; background: linear-gradient(145deg, #1e232b, #14181d); margin-bottom: 2rem; padding: 2rem; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.3); border-left: 1px solid #2a323d; border-right: 1px solid #2a323d; border-bottom: 1px solid #2a323d;">
                                
                                <div class="flex-between" style="border-bottom: 1px solid #2a313d; padding-bottom: 1rem; margin-bottom: 1.5rem;">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <span style="font-size: 0.8rem; color: #00bc8c; font-weight: 800; letter-spacing: 1.5px; background: rgba(0, 188, 140, 0.1); padding: 4px 10px; border-radius: 4px;">DOCUMENTO OFICIAL</span>
                                        <span class="status-badge ${tiempo.clase}" style="font-size: 0.8rem; padding: 4px 10px; font-weight: bold; border-radius: 4px;">${tiempo.texto}</span>
                                    </div>
                                    ${puedeEditar ? `<button class="btn-small danger" data-action="eliminar" style="background: rgba(231, 76, 60, 0.1); border: none; color: #e74c3c; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 1rem; transition: 0.2s;">🗑️ Eliminar</button>` : ''}
                                </div>

                                <div contenteditable="${puedeEditar}" data-field="titulo" class="edit-field" style="font-size: 1.45rem; font-weight: 800; color: #ffffff; margin-bottom: 1.5rem; line-height: 1.4; outline: none; border-bottom: 2px dashed transparent; transition: 0.2s; letter-spacing: -0.3px;" placeholder="Título de la convocatoria...">
                                    ${app.escape(r.titulo)}
                                </div>
                                
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                                    <div style="background: #0f1216; padding: 1rem; border-radius: 8px; border-left: 3px solid #3498db;">
                                        <span style="font-size: 0.75rem; color: #888; display: block; margin-bottom: 4px; font-weight: bold; letter-spacing: 0.5px;">📅 FECHA Y HORA PLANIFICADA</span>
                                        <input type="datetime-local" class="edit-date" value="${r.fecha || ''}" ${!puedeEditar ? 'disabled' : ''} style="background: transparent; color: #fff; border: none; font-size: 1.1rem; font-family: monospace; outline: none; width: 100%;">
                                    </div>
                                    <div style="background: #0f1216; padding: 1rem; border-radius: 8px; border-left: 3px solid #e67e22;">
                                        <span style="font-size: 0.75rem; color: #888; display: block; margin-bottom: 4px; font-weight: bold; letter-spacing: 0.5px;">📍 LUGAR DEL ENCUENTRO</span>
                                        <span contenteditable="${puedeEditar}" data-field="lugar" class="edit-field" style="font-size: 1.1rem; color: #fff; display: inline-block; width: 100%; outline: none;">${app.escape(r.lugar)}</span>
                                    </div>
                                </div>
                                
                                <div style="background: #0f1216; padding: 1.5rem; border-radius: 8px; border: 1px solid #1e232b; margin-bottom: 1.5rem;">
                                    <strong style="color: #00bc8c; display: block; margin-bottom: 0.8rem; font-size: 0.95rem; letter-spacing: 0.8px;">📋 PUNTOS DEL ORDEN DEL DÍA:</strong>
                                    <div contenteditable="${puedeEditar}" data-field="ordenDia" class="edit-field" style="white-space: pre-wrap; line-height: 1.7; color: #e0e6ed; font-size: 1.1rem; outline: none; min-height: 80px;">${app.escape(r.ordenDia)}</div>
                                </div>

                                <div style="background: rgba(241, 196, 15, 0.03); padding: 1.2rem; border-radius: 8px; border: 1px dashed rgba(241, 196, 15, 0.2);">
                                    <strong style="color: #f1c40f; display: block; margin-bottom: 0.4rem; font-size: 0.85rem; letter-spacing: 0.5px;">📝 RESOLUCIONES Y DETERMINACIONES DE LA ASAMBLEA:</strong>
                                    <div contenteditable="${puedeEditar}" data-field="notas" class="edit-field" style="white-space: pre-wrap; line-height: 1.6; color: #cbd5e1; font-size: 1rem; outline: none; min-height: 40px;" placeholder="Escribe aquí los acuerdos definitivos tomados...">${app.escape(r.notas || '')}</div>
                                </div>

                                <div style="text-align: center; margin-top: 2rem; font-size: 0.85rem; color: #505c6e; border-top: 1px dashed #2a313d; padding-top: 1.2rem; letter-spacing: 0.5px;">
                                    CONSEJO DE ADMINISTRACIÓN<br>
                                    <span style="font-weight: bold; color: #7f8c8d;">COOPERATIVA MINERA COLLPANI R.L.</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            
            // --- Handlers de Eventos Optimizados y Seguros ---

            // Captura de datos en campos de edición de texto
            container.querySelectorAll('.edit-field').forEach(elemento => {
                elemento.addEventListener('blur', (e) => {
                    const card = e.target.closest('.reunion-card');
                    const id = parseInt(card.dataset.id, 10);
                    const campo = e.target.dataset.field;
                    const valor = e.target.innerText.trim();
                    
                    const reunion = app.data.reuniones.find(r => r.id === id);
                    if (reunion) {
                        reunion[campo] = valor;
                        app.save();
                    }
                });
            });

            // Captura de datos en el campo fecha + refresco dinámico del contador de días
            container.querySelectorAll('.edit-date').forEach(input => {
                input.addEventListener('change', (e) => {
                    const card = e.target.closest('.reunion-card');
                    const id = parseInt(card.dataset.id, 10);
                    const reunion = app.data.reuniones.find(r => r.id === id);
                    if (reunion) {
                        reunion.fecha = e.target.value;
                        app.save();
                        // Volvemos a renderizar para actualizar el badge de "Faltan X días" de inmediato
                        ReunionesModule.render();
                    }
                });
            });

            // Acción del botón eliminar
            container.addEventListener('click', (e) => {
                const btnEliminar = e.target.closest('button[data-action="eliminar"]');
                if (!btnEliminar) return;
                
                const card = btnEliminar.closest('.reunion-card');
                const id = parseInt(card.dataset.id, 10);
                
                if (confirm('¿Está seguro de que desea eliminar permanentemente este documento de convocatoria?')) {
                    app.data.reuniones = app.data.reuniones.filter(r => r.id !== id);
                    app.save();
                    app.renderAll();
                }
            });

            // Botón para crear un nuevo registro formal pre-estructurado
            document.getElementById('nuevoRapidoBtn')?.addEventListener('click', () => {
                app.data.reuniones.unshift({
                    id: Date.now(),
                    titulo: "CONVOCATORIA A REUNIÓN ORDINARIA N° __/2026",
                    fecha: "",
                    lugar: "Sede Social",
                    ordenDia: "1. Control de asistencia.\n2. Lectura de acta anterior.\n3. Informes de comisiones.\n4. Asuntos urgentes.",
                    notas: ""
                });
                app.save();
                app.renderAll();
            });
        }
    };
})();