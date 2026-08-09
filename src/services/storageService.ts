import { Chamados } from "../types/chamado";

const CHAMADOS_STORAGE_EVENT = "chamados:changed";

function podeUsarStorage() {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function lerChamadosStorage(): Chamados[] {
    if (!podeUsarStorage()) return [];
    return JSON.parse(localStorage.getItem("chamados") || "[]");
}

function salvarChamadosStorage(chamados: Chamados[]) {
    if (!podeUsarStorage()) return;
    localStorage.setItem("chamados", JSON.stringify(chamados));
}

function substituirChamados(chamados: Chamados[]) {
    salvarChamadosStorage(chamados);
    emitirAlteracaoChamados();
}

function mesclarChamados(chamadosNovos: Chamados[]) {
    const chamadosAtuais = lerChamadosStorage();
    const porId = new Map<string, Chamados>();

    chamadosAtuais.forEach((chamado) => {
        porId.set(chamado.id, chamado);
    });

    chamadosNovos.forEach((chamado) => {
        porId.set(chamado.id, chamado);
    });

    salvarChamadosStorage([...porId.values()]);
    emitirAlteracaoChamados();
}

function emitirAlteracaoChamados() {
    if (!podeUsarStorage()) return;
    window.dispatchEvent(new Event(CHAMADOS_STORAGE_EVENT));
}

function salvarChamado(Chamado: Chamados){
    const chamados = lerChamadosStorage();
    chamados.push(Chamado);
    salvarChamadosStorage(chamados);
    emitirAlteracaoChamados();
}  

function buscarChamados(): Chamados[]{
    return lerChamadosStorage();
}

function atualizarChamado(Chamado: Chamados){
    const chamados = lerChamadosStorage();
    const index = chamados.findIndex((c: Chamados) => c.id === Chamado.id);
    if(index !== -1){
        chamados[index] = Chamado;
    }  
    salvarChamadosStorage(chamados);
    emitirAlteracaoChamados();
}

function deletarChamado(id: string){
    const chamados = lerChamadosStorage();
    const index = chamados.findIndex((c: Chamados) => c.id === id);
    if(index !== -1){
        chamados.splice(index, 1);
    }
    salvarChamadosStorage(chamados);
    emitirAlteracaoChamados();
}

function deletarTodosChamados(){
    if (!podeUsarStorage()) return;
    localStorage.removeItem("chamados");
    emitirAlteracaoChamados();
}

function buscarChamadoPorId(id: string): Chamados | undefined{
    const chamados = lerChamadosStorage();
    return chamados.find((c: Chamados) => c.id === id);
}

export { salvarChamado, buscarChamados, atualizarChamado, deletarChamado, deletarTodosChamados, buscarChamadoPorId };
export { substituirChamados, mesclarChamados };
export { CHAMADOS_STORAGE_EVENT };
