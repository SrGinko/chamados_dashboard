import imagemFtthPOP from '../assets/ftth_pop_indisponível.png'
import backbone from '../assets/backbone.png'
import energia from '../assets/energia.png'
import paraquemmandar from '../assets/paraquemmandar.png'


export default function Inicio() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', marginBottom: 300 }}>
                <h1>Bem Vindo!</h1>
                Pontos importantes que devemos ligar logo a baixo.
            </div>

            <div style={{marginBottom: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20, backgroundColor: '#0f0f0f', padding: 20, borderRadius: 10, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', border: '1px solid #333' }}>
                <h1>Regras de Escalonamento</h1>
                Regras que devemos seguir mediante a prioridade e o tipo de chamado.
                <div style={{ display: 'flex', gap: 20, marginTop: 50, flexWrap: 'wrap', justifyContent: 'center' }}>

                </div>
                <div>
                    <h3>Chamados de FTTH/POP indisponível</h3>
                    <img width="800" height="500" src={imagemFtthPOP} alt="FTTH/POP Indisponível" />
                </div>

                <div>
                    <h3>Chamados de Backbone</h3>
                    <img width="800" height="500" src={backbone} alt="Backbone" />
                </div>

                <div>
                    <h3>Chamados de Energia</h3>
                    <img width="800" height="500" src={energia} alt="Energia" />

                    <div>
                        <h3>Para quem Mandar</h3>
                        <img width="800" height="500" src={paraquemmandar} alt="Para quem Mandar" />
                    </div>
                </div>
            </div>
        </div>
    )
}