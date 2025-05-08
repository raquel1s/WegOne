const url = "http://localhost:8081/wegone/api"

const entrar = document.getElementById('btnEntrar');

entrar.addEventListener('click', async () => {
    const operacoes = await buscarOperacoes();

    operacoes.forEach(operacao => {
        //div para cada item da lista
        const itemLista = document.createElement('div');

        //div para colocar o titulo e categoria
        const itemTitulo = document.createElement('div');
        const categoria = document.createElement('h2');
        const titulo = document.createElement('h3');

        categoria.textContent = operacao.categoria;
        titulo.textContent = operacao.titulo;

        itemTitulo.appendChild(categoria);
        itemTitulo.appendChild(titulo);

        itemLista.appendChild(itemTitulo);

        //div para colocar os icones
        const icones = document.createElement('div');

        const mostrar = document.createElement('a');
        mostrar.innerHTML = '<i class="fa-solid fa-maximize"></i>';

        const editar = document.createElement('a');
        editar.innerHTML = '<i class="fa-solid fa-pen"></i>';

        const excluir = document.createElement('a');
        exluir.innerHTML = '<i class="fa-solid fa-trash"></i>';

        // adicionando os icones na div
        icones.appendChild(mostrar);
        icones.appendChild(editar);
        icones.appendChild(excluir);
    })
})

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

