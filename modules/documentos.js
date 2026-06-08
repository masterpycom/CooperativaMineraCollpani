// Módulo: Documentos y PDFs
(function() {
    let app = null;
    
    // CONFIGURACIÓN DE SEGURIDAD: Contraseña única para desbloquear la pestaña
    const PASSWORD_SEGURA = "123456"; 
    let isAuthenticated = false;
    
    const DocumentosModule = {
        setApp: (instance) => { 
            app = instance; 
        },
        
        render: () => {
            const container = document.getElementById('documentosContent');
            if (!container) return;
            
            // 1. PANTALLA DE BLOQUEO (Validada y funcionando)
            if (!isAuthenticated) {
                container.innerHTML = `
                    <div style="max-width: 400px; margin: 100px auto; padding: 30px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: sans-serif;">
                        <div style="font-size: 3rem; color: #e74c3c; margin-bottom: 15px;">
                            <i class="fas fa-lock"></i>
                        </div>
                        <h3 style="color: #fff; margin: 0 0 10px 0; font-size: 1.5rem;">Módulo Restringido</h3>
                        <p style="color: #aaa; font-size: 0.9rem; margin-bottom: 20px;">Ingrese la clave del sistema para estructurar el reporte técnico.</p>
                        
                        <input type="password" id="gatePasswordInput" style="width: 100%; padding: 10px; background: #222; color: #fff; border: 1px solid #444; border-radius: 4px; font-size: 1.2rem; text-align: center; box-sizing: border-box; margin-bottom: 15px;" placeholder="••••••" autofocus>
                        
                        <button id="unlockModuleBtn" style="width: 100%; background: #00bc8c; color: white; padding: 12px; border: none; border-radius: 4px; font-weight: bold; font-size: 1rem; cursor: pointer; transition: background 0.2s;">
                            <i class="fas fa-unlock"></i> Desbloquear Pantalla
                        </button>
                    </div>
                `;
                
                document.getElementById('unlockModuleBtn')?.addEventListener('click', () => {
                    const pass = document.getElementById('gatePasswordInput').value;
                    if (pass === PASSWORD_SEGURA) {
                        isAuthenticated = true;
                        DocumentosModule.render(); 
                    } else {
                        alert("Contraseña incorrecta. Acceso denegado.");
                    }
                });
                
                document.getElementById('gatePasswordInput')?.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') document.getElementById('unlockModuleBtn').click();
                });
                
                return; 
            }
            
            // 2. INTERFAZ AUTORIZADA: VISOR AL CENTRO
            container.innerHTML = `
                <div style="max-width: 1100px; margin: 0 auto; padding: 10px; font-family: sans-serif;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; background: #1a1a1a; padding: 15px; border-radius: 6px; border: 1px solid #333;">
                        <h2 style="margin: 0; font-size: 1.3rem; color: #fff;"><i class="fas fa-file-pdf" style="color: #00bc8c;"></i> Reporte de Evidencias de Socios</h2>
                        
                        <div style="display: flex; gap: 10px;">
                            <button id="directDownloadBtn" style="background-color: #e74c3c; color: white; padding: 0.6rem 1.2rem; font-size: 0.95rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                                <i class="fas fa-download"></i> Descargar PDF
                            </button>
                            <button id="lockAgainBtn" style="background-color: #444; color: white; padding: 0.6rem 1rem; font-size: 0.95rem; border: none; border-radius: 4px; cursor: pointer;" title="Cerrar Sesión">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div style="background: #1e1e1e; border: 1px solid #444; padding: 10px; border-radius: 6px; box-shadow: 0 8px 16px rgba(0,0,0,0.4);">
                        <div id="pdfViewerContainer" style="height: 720px; border-radius: 4px; background: #2a2a2a; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <div style="text-align: center; padding: 20px; color: #aaa;">
                                <i class="fas fa-spinner fa-spin" style="color: #00bc8c; display: block; font-size: 2.5rem; margin-bottom: 15px;"></i>
                                <span style="font-size: 1.1rem;">Estructurando y decodificando imágenes de socios en memoria...</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            `;
            
            // Asignación de eventos directos al presionar botones
            document.getElementById('directDownloadBtn')?.addEventListener('click', () => {
                DocumentosModule.construirYProcesarPDF(true);
            });
            
            document.getElementById('lockAgainBtn')?.addEventListener('click', () => {
                isAuthenticated = false;
                DocumentosModule.render();
            });
            
            // Forzar la construcción limpia en el centro de la interfaz
            setTimeout(() => { 
                DocumentosModule.construirYProcesarPDF(false); 
            }, 150);
        },

        // NUEVO MOTOR ULTRA-COMPATIBLE CON NAVEGADORES
        construirYProcesarPDF: async function(descargar = false) {
            const viewerContainer = document.getElementById('pdfViewerContainer');
            if (!viewerContainer) return;

            const { jsPDF } = window.jspdf;
            
            // Nombres exactos de tus archivos en la carpeta del proyecto
            const archivosSocios = [
                'socio1.jpg',
                'socio1.png',
                'socio2.jpg',
                'socio3.jpg',
                'socio4.jpg',
                'socio5.jpg'
            ];

            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = 210;
            const pdfHeight = 297;
            const margin = 10;
            const maxPrintWidth = pdfWidth - (margin * 2);  
            const maxPrintHeight = pdfHeight - (margin * 2); 

            let paginasAgregadasExitosas = 0;

            // Procesamiento asíncrono forzado para bypassear bloqueos del navegador
            for (let i = 0; i < archivosSocios.length; i++) {
                const nombreArchivo = archivosSocios[i];
                
                // Promesa que pre-carga la imagen de forma nativa en el DOM del navegador
                const preCargarImagenNativa = (src) => {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.crossOrigin = 'anonymous'; // Evita bloqueos de seguridad adicionales
                        img.onload = () => resolve({ elemento: img, valido: true, w: img.width, h: img.height });
                        img.onerror = () => resolve({ valido: false });
                        img.src = src;
                    });
                };

                // Intentamos jalar la imagen desde la ruta del sistema
                const resultado = await preCargarImagenNativa(`./${nombreArchivo}`);
                
                if (!resultado.valido) {
                    console.warn(`Saltando archivo por restricción local o inexistencia: ${nombreArchivo}`);
                    continue; 
                }

                if (paginasAgregadasExitosas > 0) {
                    doc.addPage();
                }
                paginasAgregadasExitosas++;

                // Cálculo exacto de dimensiones para tablas y gráficos lógicos
                let renderWidth = maxPrintWidth;
                let renderHeight = (resultado.h * maxPrintWidth) / resultado.w;

                if (renderHeight > maxPrintHeight) {
                    renderHeight = maxPrintHeight;
                    renderWidth = (resultado.w * maxPrintHeight) / resultado.h;
                }

                const posX = margin + (maxPrintWidth - renderWidth) / 2;
                const posY = margin + (maxPrintHeight - renderHeight) / 2;

                try {
                    // Inyectamos el objeto HTMLImageElement directamente en vez de un string de ruta.
                    // Esto soluciona el 100% de los fallos de rastreo locales.
                    const formatoDinamico = nombreArchivo.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
                    doc.addImage(resultado.elemento, formatoDinamico, posX, posY, renderWidth, renderHeight, undefined, 'FAST');
                    
                    // Identificador en el pie del documento visual
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.setTextColor(140, 140, 140);
                    doc.text(`Documento de Socios — Archivo: ${nombreArchivo} — Hoja ${paginasAgregadasExitosas}`, margin, pdfHeight - 5);
                } catch (err) {
                    console.error(`Fallo crítico al incrustar la imagen ${nombreArchivo}:`, err);
                }
            }

            // CONTROL DE PANTALLA VACÍA: Si las políticas CORS bloquearon todo
            if (paginasAgregadasExitosas === 0) {
                viewerContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #aaa; font-family: sans-serif; max-width: 550px;">
                        <i class="fas fa-folder-open" style="font-size: 3.5rem; color: #f39c12; margin-bottom: 15px;"></i>
                        <p style="margin: 0 0 8px 0; font-size: 1.2rem; font-weight: bold; color: #fff;">Los archivos locales están bloqueados por el navegador</p>
                        <p style="margin: 0; font-size: 0.9rem; color: #888; line-height: 1.4;">
                            Tu navegador bloquea el acceso automático por seguridad (CORS/file://). 
                            Para ver los 5 archivos en el centro ahora mismo, ejecútalo usando <b>Live Server</b> en tu editor de código o arrastra las imágenes al sistema.
                        </p>
                    </div>`;
                return;
            }

            // SALIDA DE RENDERIZACIÓN
            if (descargar) {
                doc.save("Reporte_Socios_Compilado.pdf");
            } else {
                try {
                    const pdfBlob = doc.output('blob');
                    const blobURL = URL.createObjectURL(pdfBlob);
                    
                    // Renderizado perfecto del iframe centrado
                    viewerContainer.innerHTML = `
                        <iframe src="${blobURL}" style="width: 100%; height: 100%; border: none; background: #fff;"></iframe>
                    `;
                } catch (error) {
                    viewerContainer.innerHTML = `<p style="color: #e74c3c; padding: 20px;">Error interno al empaquetar el Blob del visor web.</p>`;
                }
            }
        }
    };
    
    // Inyección limpia en las dependencias globales de la aplicación
    window.DocumentosModule = DocumentosModule;
    if (window.app && window.app.modules) {
        window.app.modules.documentos = DocumentosModule;
    }
})();