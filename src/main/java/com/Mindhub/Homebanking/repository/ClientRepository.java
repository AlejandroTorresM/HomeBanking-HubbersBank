package com.Mindhub.Homebanking.repository;

import java.util.List;
import com.Mindhub.Homebanking.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource
public interface ClientRepository extends JpaRepository<Client, Long> {

    Client findByEmail(String email);

}

