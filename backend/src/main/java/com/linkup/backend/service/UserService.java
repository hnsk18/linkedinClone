package com.linkup.backend.service;

import com.linkup.backend.model.User;
import com.linkup.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // REGISTER
    public User registerUser(User user){

        if(user.getName() == null || user.getName().isBlank()){
            throw new RuntimeException("Name is required");
        }
        if(userRepository.findByEmail(user.getEmail()) != null){
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // LOGIN
    public User login(String email, String password){

        User user = userRepository.findByEmail(email);

        if(user == null){
            return null;
        }

        if(!passwordEncoder.matches(password, user.getPassword())){
            return null;
        }

        return user;
    }
}