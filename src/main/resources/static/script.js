const url = "http://localhost:8081/wegone/api"

async function buscarOperacoes(){
    try{
        const resposta = await fetch(url);

        if(!resposta.ok) throw new Error("Erro ao encontrar as operações!"+ resposta.status);

        const operacoes = await resposta.json();
        return operacoes;
    }catch (error){
        const mensagemErro = document.createElement('p');
        mensagemErro.textContent = error.message;
    }
}

async function buscarOperacaoPorNome(titulo){
    try{
        const resposta = await fetch(`${url}/titulo/${titulo}`);

        if(!resposta.ok) throw new Error("Erro ao encontrar a operação!");

        const operacao = await resposta.json();
        return operacao;
    }catch (error){
        const mensagemErro = document.createElement('p');
        mensagemErro.textContent = error.message;
    }
}

async function buscarOperacaoPorId(id){
    try{
        const resposta = await fetch(`${url}/${id}`);

        if(!resposta.ok) throw new Error("Erro ao encontrar a operação!");

        const operacao = await resposta.json();
        return operacao;
    }catch (error){
        const mensagemErro = document.createElement('p');
        mensagemErro.textContent = error.message;
    }
}

// ira receber um objeto já
async function salvarOperacao(operacao, metodo){

    const mensagem = document.createElement('p');

    try{
        const resposta = fetch(url, {
            method: metodo, // se clicar no adicionar vai enviar POST se for no editar vai enviar PUT
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(operacao)
        });

        if(!resposta.ok) throw new Error("Erro ao salvar a operação!");

        mensagem.textContent = 'Operação salva com sucesso!';

    }catch (error){
        mensagem.textContent = error.message;
    }
}

async function excluirOperacao(operacao){

    const mensagem = document.createElement('p');

    try{
        const resposta = await fetch(`${url}/${operacao.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if(!resposta.ok) throw new Error("Erro ao excluir a operação!");

        mensagem.textContent = 'Operação excluida com sucesso!';

    }catch (error){
        mensagem.textContent = error.message;
    }
}

