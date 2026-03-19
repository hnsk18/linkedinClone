package com.linkup.backend.service;

import com.linkup.backend.model.*;
import com.linkup.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private ProfileAnalyticsRepository profileAnalyticsRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private JobPreferenceRepository jobPreferenceRepository;

    public Map<String, Object> getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Experience> experiences = experienceRepository.findByUserOrderByStartDateDesc(user);
        List<Education> educationList = educationRepository.findByUserOrderByStartYearDesc(user);

        List<UserSkill> userSkills = userSkillRepository.findByUser(user);
        List<Skill> skills = userSkills.stream()
                .map(UserSkill::getSkill)
                .collect(Collectors.toList());

        List<Certification> certifications = certificationRepository.findByUserOrderByIssueDateDesc(user);

        ProfileAnalytics analytics = profileAnalyticsRepository.findByUser(user);

        JobPreference jobPreference = jobPreferenceRepository.findByUser(user).orElse(null);

        Map<String, Object> result = new HashMap<>();
        result.put("user", user);
        result.put("experience", experiences);
        result.put("education", educationList);
        result.put("skills", skills);
        result.put("certifications", certifications);
        result.put("analytics", analytics);
        result.put("jobPreference", jobPreference);

        return result;
    }

    public List<Post> getUserPosts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getEmail() == null) {
            throw new RuntimeException("User email is not set");
        }

        return postRepository.findByAuthorEmailOrderByCreatedAtDesc(user.getEmail());
    }

    public Experience addExperience(Long userId, Experience experience) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        experience.setUser(user);
        return experienceRepository.save(experience);
    }

    public Education addEducation(Long userId, Education education) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        education.setUser(user);
        return educationRepository.save(education);
    }

    public List<Skill> addSkill(Long userId, String skillName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skill skill = skillRepository.findByNameIgnoreCase(skillName);
        if (skill == null) {
            skill = new Skill(skillName);
            skill = skillRepository.save(skill);
        }

        UserSkill userSkill = new UserSkill();
        userSkill.setUser(user);
        userSkill.setSkill(skill);
        userSkillRepository.save(userSkill);

        List<UserSkill> userSkills = userSkillRepository.findByUser(user);
        return userSkills.stream()
                .map(UserSkill::getSkill)
                .collect(Collectors.toList());
    }

    public Certification addCertification(Long userId, Certification certification) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        certification.setUser(user);
        return certificationRepository.save(certification);
    }

    public Experience updateExperience(Long userId, Long experienceId, Experience patch) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Experience exp = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new RuntimeException("Experience not found"));
        if (exp.getUser() == null || exp.getUser().getId() == null || !exp.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        if (patch.getTitle() != null) exp.setTitle(patch.getTitle());
        if (patch.getCompany() != null) exp.setCompany(patch.getCompany());
        if (patch.getEmploymentType() != null) exp.setEmploymentType(patch.getEmploymentType());
        if (patch.getStartDate() != null) exp.setStartDate(patch.getStartDate());
        if (patch.getEndDate() != null) exp.setEndDate(patch.getEndDate());
        if (patch.getDescription() != null) exp.setDescription(patch.getDescription());

        return experienceRepository.save(exp);
    }

    public Education updateEducation(Long userId, Long educationId, Education patch) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Education edu = educationRepository.findById(educationId)
                .orElseThrow(() -> new RuntimeException("Education not found"));
        if (edu.getUser() == null || edu.getUser().getId() == null || !edu.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        if (patch.getCollegeName() != null) edu.setCollegeName(patch.getCollegeName());
        if (patch.getDegree() != null) edu.setDegree(patch.getDegree());
        if (patch.getFieldOfStudy() != null) edu.setFieldOfStudy(patch.getFieldOfStudy());
        if (patch.getStartYear() != null) edu.setStartYear(patch.getStartYear());
        if (patch.getEndYear() != null) edu.setEndYear(patch.getEndYear());

        return educationRepository.save(edu);
    }

    public Certification updateCertification(Long userId, Long certificationId, Certification patch) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Certification cert = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new RuntimeException("Certification not found"));
        if (cert.getUser() == null || cert.getUser().getId() == null || !cert.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        if (patch.getTitle() != null) cert.setTitle(patch.getTitle());
        if (patch.getOrganization() != null) cert.setOrganization(patch.getOrganization());
        if (patch.getIssueDate() != null) cert.setIssueDate(patch.getIssueDate());
        if (patch.getCredentialId() != null) cert.setCredentialId(patch.getCredentialId());
        if (patch.getCredentialUrl() != null) cert.setCredentialUrl(patch.getCredentialUrl());

        return certificationRepository.save(cert);
    }

    public List<Skill> removeSkill(Long userId, Long skillId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        UserSkill userSkill = userSkillRepository.findByUserAndSkill(user, skill);
        if (userSkill != null) {
            userSkillRepository.delete(userSkill);
        }

        List<UserSkill> userSkills = userSkillRepository.findByUser(user);
        return userSkills.stream().map(UserSkill::getSkill).collect(Collectors.toList());
    }

    public JobPreference updateJobPreference(Long userId, JobPreference patch) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        JobPreference pref = jobPreferenceRepository.findByUser(user).orElse(new JobPreference());
        pref.setUser(user);

        if (patch.getJobTitles() != null) pref.setJobTitles(patch.getJobTitles());
        if (patch.getLocationTypes() != null) pref.setLocationTypes(patch.getLocationTypes());
        if (patch.getLocations() != null) pref.setLocations(patch.getLocations());
        if (patch.getStartDate() != null) pref.setStartDate(patch.getStartDate());
        if (patch.getEmploymentTypes() != null) pref.setEmploymentTypes(patch.getEmploymentTypes());
        if (patch.getNoticePeriod() != null) pref.setNoticePeriod(patch.getNoticePeriod());
        if (patch.getExpectedSalary() != null) pref.setExpectedSalary(patch.getExpectedSalary());
        if (patch.getVisibility() != null) pref.setVisibility(patch.getVisibility());

        return jobPreferenceRepository.save(pref);
    }
}

