package com.linkup.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final String UPLOAD_DIR = "uploads";
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
    private static final List<String> ALLOWED_IMAGE_TYPES = List.of("image/jpeg", "image/png", "image/gif", "image/webp");
    private static final List<String> ALLOWED_VIDEO_TYPES = List.of("video/mp4", "video/webm", "video/quicktime");

    public List<String> storeFiles(MultipartFile[] files) throws IOException {
        if (files == null || files.length == 0) {
            return new ArrayList<>();
        }
        Path root = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            String contentType = file.getContentType();
            if (contentType == null || (!ALLOWED_IMAGE_TYPES.contains(contentType) && !ALLOWED_VIDEO_TYPES.contains(contentType))) {
                throw new IllegalArgumentException("Invalid file type: " + contentType + ". Allowed: images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, QuickTime).");
            }
            if (file.getSize() > MAX_FILE_SIZE) {
                throw new IllegalArgumentException("File too large: " + file.getOriginalFilename() + ". Max 50 MB.");
            }
            String ext = getExtension(file.getOriginalFilename(), contentType);
            String filename = UUID.randomUUID().toString() + ext;
            Path target = root.resolve(filename);
            Files.copy(file.getInputStream(), target);
            urls.add("/uploads/" + filename);
        }
        return urls;
    }

    private static String getExtension(String originalFilename, String contentType) {
        if (originalFilename != null && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf('.'));
        }
        if (contentType != null) {
            if (contentType.contains("jpeg") || contentType.contains("jpg")) return ".jpg";
            if (contentType.contains("png")) return ".png";
            if (contentType.contains("gif")) return ".gif";
            if (contentType.contains("webp")) return ".webp";
            if (contentType.contains("mp4")) return ".mp4";
            if (contentType.contains("webm")) return ".webm";
            if (contentType.contains("quicktime")) return ".mov";
        }
        return "";
    }
}
