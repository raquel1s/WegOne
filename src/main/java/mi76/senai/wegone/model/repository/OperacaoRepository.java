package mi76.senai.wegone.model.repository;

import mi76.senai.wegone.model.entity.Operacao;
import org.springframework.data.repository.CrudRepository;

public interface OperacaoRepository extends CrudRepository<Operacao, Integer> {
    public Iterable<Operacao> findByTituloContainingIgnoreCase(String titulo);
}
