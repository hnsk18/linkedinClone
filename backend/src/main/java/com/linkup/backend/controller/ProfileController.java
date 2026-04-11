package com.linkup.backend.controller;

import com.linkup.backend.model.Certification;
import com.linkup.backend.model.Education;
import com.linkup.backend.model.Experience;
import com.linkup.backend.model.JobPreference;
import com.linkup.backend.model.Post;
import com.linkup.backend.model.Skill;
import com.linkup.backend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"})
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/{identifier}")
    public ResponseEntity<Map<String, Object>> getProfile(@PathVariable String identifier) {
        Map<String, Object> profile = profileService.getProfile(identifier);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/{identifier}/posts")
    public ResponseEntity<List<Post>> getUserPosts(@PathVariable String identifier) {
        List<Post> posts = profileService.getUserPosts(identifier);
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/{userId}/experience")
    public ResponseEntity<Experience> addExperience(@PathVariable Long userId,
                                                    @RequestBody Experience experience) {
        Experience saved = profileService.addExperience(userId, experience);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{userId}/education")
    public ResponseEntity<Education> addEducation(@PathVariable Long userId,
                                                  @RequestBody Education education) {
        Education saved = profileService.addEducation(userId, education);
        return ResponseEntity.ok(saved);
    }

    public static class AddSkillRequest {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    @PostMapping("/{userId}/skill")
    public ResponseEntity<List<Skill>> addSkill(@PathVariable Long userId,
                                                @RequestBody AddSkillRequest request) {
        List<Skill> skills = profileService.addSkill(userId, request.getName());
        return ResponseEntity.ok(skills);
    }

    @PostMapping("/{userId}/certification")
    public ResponseEntity<Certification> addCertification(@PathVariable Long userId,
                                                          @RequestBody Certification certification) {
        Certification saved = profileService.addCertification(userId, certification);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{userId}/experience/{experienceId}")
    public ResponseEntity<Experience> updateExperience(@PathVariable Long userId,
                                                       @PathVariable Long experienceId,
                                                       @RequestBody Experience patch) {
        Experience updated = profileService.updateExperience(userId, experienceId, patch);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{userId}/education/{educationId}")
    public ResponseEntity<Education> updateEducation(@PathVariable Long userId,
                                                     @PathVariable Long educationId,
                                                     @RequestBody Education patch) {
        Education updated = profileService.updateEducation(userId, educationId, patch);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{userId}/certification/{certificationId}")
    public ResponseEntity<Certification> updateCertification(@PathVariable Long userId,
                                                             @PathVariable Long certificationId,
                                                             @RequestBody Certification patch) {
        Certification updated = profileService.updateCertification(userId, certificationId, patch);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{userId}/skill/{skillId}")
    public ResponseEntity<List<Skill>> removeSkill(@PathVariable Long userId,
                                                   @PathVariable Long skillId) {
        List<Skill> skills = profileService.removeSkill(userId, skillId);
        return ResponseEntity.ok(skills);
    }

    @PutMapping("/{userId}/job-preferences")
    public ResponseEntity<JobPreference> updateJobPreferences(@PathVariable Long userId,
                                                              @RequestBody JobPreference patch) {
        JobPreference updated = profileService.updateJobPreference(userId, patch);
        return ResponseEntity.ok(updated);
    }
}

