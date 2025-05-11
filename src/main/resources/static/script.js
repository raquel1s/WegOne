const url = "http://localhost:8081/wegone/api";

const adicionar = document.getElementById('adicionar');

const formulario = document.getElementById('formulario');

const sobreposicao = document.getElementById('sobreposicao');

const sobreposicaoMostrar = document.getElementById('sobreposicaoMostrar');

const sobreposicaoExcluir = document.getElementById('sobreposicaoExcluir');

let modoEdicao = false;

const buscar = document.getElementById('buscar');

const listagem = document.getElementById('listagem');

const botaoExluir = document.getElementById('botaoExcluir');

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

        if(!operacaoPesquisada || (Array.isArray(operacaoPesquisada) && operacaoPesquisada.length === 0)){
            const mensagemErro = document.createElement('p');
            mensagemErro.textContent = 'Operação não Encontrada!';
            mensagemErro.classList.add('mt-6', 'font-semibold', 'text-red-500', 'text-lg', 'text-center');
            listagem.classList.add('shadow-none');
            listagem.innerHTML = '';
            listagem.appendChild(mensagemErro);
        }else{
            await carregarLista(Array.isArray(operacaoPesquisada) ? operacaoPesquisada : [operacaoPesquisada]);
        }

    }
});

adicionar.addEventListener('click', () => {
    // Remove classe hidden e deixa o painel de cadastro visível
    sobreposicao.classList.remove("hidden");
    const titulo = document.getElementById('tituloTelaCadastro');
    titulo.textContent = "CADASTRAR";
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

// fechar painel-cadastrar
document.getElementById('fecharPainel').addEventListener('click', () => {
    document.getElementById('sobreposicao').classList.add('hidden');

});

async function carregarLista(operacoes){
    operacoes.forEach(operacao => {
        //div para cada item da lista
        const itemLista = document.createElement('div');
        itemLista.classList.add('flex', 'flex-row', 'justify-between', 'items-center', 'pb-2', 'shadow-md', 'px-10', 'pt-3');

        //div para colocar o titulo e categoria
        const itemTitulo = document.createElement('div');

        const categoriaElemento = document.createElement('h2');
        categoriaElemento.classList.add('text-lg', 'font-bold');

        const tituloElemento = document.createElement('h3');
        tituloElemento.classList.add('text-base');

        categoriaElemento.textContent = operacao.categoria;
        categoriaElemento.style.color = '#0090C5';

        tituloElemento.textContent = operacao.titulo;

        itemTitulo.appendChild(categoriaElemento);
        itemTitulo.appendChild(tituloElemento);

        itemLista.appendChild(itemTitulo);

        //div para colocar os icones
        const icones = document.createElement('div');
        icones.style.color = '#00579D';
        icones.classList.add('flex', 'flex-row', 'gap-6');

        const mostrar = document.createElement('a');
        mostrar.innerHTML = '<i class="fa-solid fa-maximize cursor-pointer" style="font-size: 1.6em"></i>';

        const editar = document.createElement('a');
        editar.innerHTML = '<i class="fa-solid fa-pen cursor-pointer" style="font-size: 1.6em"></i>';

        const excluir = document.createElement('a');
        excluir.innerHTML = '<i class="fa-solid fa-trash cursor-pointer" style="font-size: 1.6em"></i>';

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
            titulo.textContent = "EDITAR";

            document.getElementById('titulo').value = operacao.titulo;
            document.getElementById('categoria').value = operacao.categoria;
            document.getElementById('descricao').value = operacao.descricao;

            formulario.dataset.operacaoId = operacao.id;
        })

        excluir.addEventListener('click', () => {
            sobreposicaoExcluir.classList.remove('hidden');
            botaoExluir.dataset.operacaoId = operacao.id;
        })

        mostrar.addEventListener('click', async () => {
            const titulo = document.getElementById('tituloMostrar');
            titulo.textContent = operacao.titulo;
            const categoria = document.getElementById('categoriaMostrar');
            categoria.textContent = operacao.categoria;
            const descricao = document.getElementById('descricaoMostrar');
            descricao.textContent = operacao.descricao;

            sobreposicaoMostrar.classList.remove('hidden');

            // fechar mostrar
            document.getElementById('fecharMostrar').addEventListener('click', () => {
                document.getElementById('sobreposicaoMostrar').classList.add('hidden');
            })
        })
    })
}

botaoExluir.addEventListener('click', async () => {
    const operacaoId = botaoExluir.dataset.operacaoId;
    await excluirOperacao(operacaoId);
    await atualizarLista();
    sobreposicaoExcluir.classList.add('hidden');
});

document.getElementById('botaoCancelar').addEventListener('click', () => {
    sobreposicaoExcluir.classList.add('hidden');
})

window.addEventListener('load', async () => {
    const operacoes = await buscarOperacoes();
    await carregarLista(operacoes);
})

async function buscarOperacoes(){
    try {
        const resposta = await fetch(url);

        if(!resposta.ok) throw new Error("Erro ao encontrar as operações!"+ resposta.status);

        const operacoes = await resposta.json();
        console.log("Operações recebidas: ", operacoes);
        return operacoes;
    } catch (error){
        const mensagemErro = document.createElement('p');
        mensagemErro.textContent = error.message;
        console.log("Erro em buscarOperacoes: ", error);
        return [];
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

async function buscarOperacaoPorCategoria(categoria){
    try{
        const resposta = await fetch(`${url}/categoria/${categoria}`);

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

        const operacaoSalva = await resposta.json(); // pega a resposta do backend
        mensagem.textContent = 'Operação salva com sucesso!';
        return operacaoSalva;

    }catch (error){
        mensagem.textContent = error.message;
        console.error(error.message);
    }
}

async function excluirOperacao(operacaoId){

    const mensagem = document.createElement('p');

    try{
        const resposta = await fetch(`${url}/${operacaoId}`, {
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