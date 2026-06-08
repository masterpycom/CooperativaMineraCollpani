// Módulo: Socios / Integrantes (Versión Vista / Tabla Dinámica desde App)
(function() {
    let app = null;
    
    const SociosModule = {
        setApp: (instance) => { app = instance; },
        
        render: () => {
            const container = document.getElementById('sociosContent');
            if (!container) return;
            
            // CONECTADO: Ahora extraemos la lista directamente desde el núcleo de la aplicación
            const listaSocios = app.data.integrantes;

            const html = `
                <div class="flex-between" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <h2><i class="fas fa-id-card"></i> Socios Fundadores</h2>
                </div>
                
                <div class="card" style="overflow-x: auto; background: #fff; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid #e2e8f0; background-color: #f8fafc;">
                                <th style="padding: 12px 8px; color: #4a5568;">Nombre Completo</th>
                                <th style="padding: 12px 8px; color: #4a5568;">Cédula de Identidad (CI)</th>
                                <th style="padding: 12px 8px; color: #4a5568;">Cargo</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${listaSocios.map(m => `
                                <tr style="border-bottom: 1px solid #edf2f7;">
                                    <td style="padding: 12px 8px; font-weight: 500; color: #1a202c;">${app.escape(m.nombre)}</td>
                                    <td style="padding: 12px 8px; color: #4a5568;">${app.escape(m.ci)}</td>
                                    <td style="padding: 12px 8px;">
                                        <span style="background: #edf2f7; padding: 4px 8px; border-radius: 4px; font-size: 0.9rem; color: #2d3748;">
                                            ${app.escape(m.cargo)}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="card" style="margin-top: 1rem; background: #f8fafc; padding: 1rem; border-radius: 8px; border-left: 4px solid #f5b042;">
                    <strong>Total registrados:</strong> ${listaSocios.length} socios
                </div>
            `;
            
            container.innerHTML = html;
        }
    };
    
    window.SociosModule = SociosModule;
})();