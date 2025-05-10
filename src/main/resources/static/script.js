const url = "http://localhost:8081/wegone/api"

const adicionar = document.getElementById('adicionar');

const formulario = document.getElementById('formulario');

const sobreposicao = document.getElementById('sobreposicao');

let modoEdicao = false;

const buscar = document.getElementById('buscar');

const listagem = document.getElementById('listagem');

async function atualizarLista(){
    listagem.innerHTML = '';
    const operacoes = await buscarOperacoes();
    await carregarLista(operacoes);
}

buscar.addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
        const itemPesquisado = buscar.value;

        let operacaoPesquisada;

        if(!isNaN(itemPesquisado)){
            operacaoPesquisada = await buscarOperacaoPorId(itemPesquisado);
        }else{
            operacaoPesquisada = await buscarOperacaoPorNome(itemPesquisado);
        }

        buscar.value = '';
        listagem.innerHTML = "";
        await carregarLista(Array.isArray(operacaoPesquisada) ? operacaoPesquisada : [operacaoPesquisada]);
    }
});

adicionar.addEventListener('click', () => {
    // Remove classe hidden e deixa o painel de cadastro visível
    sobreposicao.classList.remove("hidden");
    const titulo = document.getElementById('tituloTelaCadastro');
    titulo.textContent = "Cadastrar";
})

formulario.addEventListener('submit', async(e) => {
    e.preventDefault();
    sobreposicao.classList.add('hidden');

    const titulo = document.getElementById('titulo').value;
    const categoria = document.getElementById('categoria').value;
    const descricao = document.getElementById('descricao').value;

    const operacao = {
        id: formulario.dataset.operacaoId,
        titulo: titulo,
        categoria: categoria,
        descricao: descricao
    }

    const metodo = modoEdicao ? 'PUT' : 'POST';

    await salvarOperacao(operacao, metodo);
    modoEdicao = false;
    formulario.reset();
    formulario.removeAttribute('data-operacao-id');

    await atualizarLista();
})

async function carregarLista(operacoes){
    operacoes.forEach(operacao => {
        //div para cada item da lista
        const itemLista = document.createElement('div');
        itemLista.classList.add('flex', 'flex-row', 'justify-between', 'items-center');

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
        excluir.innerHTML = '<i class="fa-solid fa-trash"></i>';

        // adicionando os icones na div
        icones.appendChild(mostrar);
        icones.appendChild(editar);
        icones.appendChild(excluir);

        itemLista.appendChild(icones);
        listagem.appendChild(itemLista);

        editar.addEventListener('click', () => {
            modoEdicao = true;

            sobreposicao.classList.remove("hidden");
            const titulo = document.getElementById('tituloTelaCadastro');
            titulo.textContent = "Editar";

            document.getElementById('titulo').value = operacao.titulo;
            document.getElementById('categoria').value = operacao.categoria;
            document.getElementById('descricao').value = operacao.descricao;

            formulario.dataset.operacaoId = operacao.id;
        })

        excluir.addEventListener('click', async () => {
            await excluirOperacao(operacao);
            await atualizarLista();
        })
    })
}

window.addEventListener('load', async () => {
    const operacoes = await buscarOperacoes();

    await carregarLista(operacoes);
})

async function buscarOperacoes(){
    try {
        const resposta = await fetch(url);

        if(!resposta.ok) throw new Error("Erro ao encontrar as operações!"+ resposta.status);

        const operacoes = await resposta.json();
        return operacoes;
    } catch (error){
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

// vou ter que separar o put do post, e chamar os dados para a tela de editar
async function salvarOperacao(operacao, metodo){

    const mensagem = document.createElement('p');

    const endpoint = metodo === 'PUT' ? `${url}/${operacao.id}` : url;

    try{
        const resposta = await fetch(endpoint, {
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

