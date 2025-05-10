package mi76.senai.wegone.controller;

import jakarta.validation.Valid;
import mi76.senai.wegone.model.entity.Operacao;
import mi76.senai.wegone.model.repository.OperacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/wegone/api")
public class OperacoesController {

    @Autowired
    private OperacaoRepository operacaoRepository;

    @PostMapping
    public @ResponseBody Operacao salvarOperacao(@Valid @RequestBody Operacao operacao){
        return operacaoRepository.save(operacao);
    }

    @PutMapping(path = "/{id}")
    public @ResponseBody Operacao editarOperacao(@PathVariable int id, @Valid @RequestBody Operacao operacao){
        operacao.setId(id);
        return operacaoRepository.save(operacao);
    }

    @GetMapping
    public Iterable<Operacao> listarOperacoes(){
        return operacaoRepository.findAll();
    }

    @GetMapping(path = "/{id}")
    public Optional<Operacao> obterOperacaoId(@PathVariable int id){
        return operacaoRepository.findById(id);
    }

    @GetMapping(path = "/titulo/{titulo}")
    public Iterable<Operacao> obterOperacoesTitulo(@PathVariable String titulo){
        return operacaoRepository.findByTituloContainingIgnoreCase(titulo);
    }

    @GetMapping(path = "/categoria/{categoria}")
    public Iterable<Operacao> obterOperacoesCategoria(@PathVariable String categoria){
        return operacaoRepository.findByCategoriaContainingIgnoreCase(categoria);
    }

    @DeleteMapping(path = "/{id}")
    public void deletarOperacaoId(@PathVariable int id){
        operacaoRepository.deleteById(id);
    }
}
