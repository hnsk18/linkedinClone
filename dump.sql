-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: linkup
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `certification`
--

DROP TABLE IF EXISTS `certification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `credential_id` varchar(255) DEFAULT NULL,
  `credential_url` varchar(255) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6v74cyhwkimnwpqejckcrb2mk` (`user_id`),
  CONSTRAINT `FK6v74cyhwkimnwpqejckcrb2mk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKjmhx0ociffsvq09ibfocsv15w` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certification`
--

LOCK TABLES `certification` WRITE;
/*!40000 ALTER TABLE `certification` DISABLE KEYS */;
/*!40000 ALTER TABLE `certification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `author_email` varchar(255) NOT NULL,
  `author_name` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `post_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbqnvawwwv4gtlctsi3o7vs131` (`post_id`),
  CONSTRAINT `FKbqnvawwwv4gtlctsi3o7vs131` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'hemanth3@gmail.com','hemanth3','jai babu','2026-03-07 16:04:10.677730','2026-03-07 16:04:10.677730',15);
INSERT INTO `comments` VALUES (2,'hemanth4@gmail.com','hemanth4','jai babu','2026-03-07 16:04:24.009638','2026-03-07 16:04:24.009638',15);
INSERT INTO `comments` VALUES (3,'hemanth4@gmail.com','hemanth4','jai babu','2026-03-07 16:05:29.551743','2026-03-07 16:05:29.551743',15);
INSERT INTO `comments` VALUES (4,'hemanth4@gmail.com','hemanth4','jai babu','2026-03-07 16:06:11.174735','2026-03-07 16:06:11.174735',15);
INSERT INTO `comments` VALUES (6,'hemanth@gmail.com','Hemanth','hello this the first account','2026-03-08 19:36:12.343876','2026-03-08 19:36:12.343876',15);
INSERT INTO `comments` VALUES (7,'hemanth@gmail.com','Hemanth','hiiiiiiii','2026-03-08 19:40:36.863065','2026-03-08 19:40:36.863065',16);
INSERT INTO `comments` VALUES (8,'hemanth@gmail.com','Hemanth','thank youcsa','2026-03-08 21:07:32.397466','2026-03-08 21:08:32.437799',22);
INSERT INTO `comments` VALUES (9,'hemanth@gmail.com','Hemanth','karri','2026-03-08 21:36:00.614860','2026-03-08 21:36:00.614860',19);
INSERT INTO `comments` VALUES (11,'hemanth5@gmail.com','hemanth5','hello','2026-03-09 14:49:48.150518','2026-03-09 14:49:48.150518',32);
INSERT INTO `comments` VALUES (12,'hemanth5@gmail.com','hemanth5','hi everyone','2026-03-09 15:01:51.158779','2026-03-09 15:01:51.158779',32);
INSERT INTO `comments` VALUES (13,'hemanth5@gmail.com','hemanth5','hkj;dsh,a JPMOAKL3','2026-03-09 15:02:06.350946','2026-03-09 15:02:06.350946',16);
INSERT INTO `comments` VALUES (14,'hemanth@gmail.com','Hemanth','mwwwww','2026-03-16 15:14:43.776707','2026-03-16 15:14:43.776707',36);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `education`
--

DROP TABLE IF EXISTS `education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `education` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `college_name` varchar(255) DEFAULT NULL,
  `degree` varchar(255) DEFAULT NULL,
  `end_year` int DEFAULT NULL,
  `field_of_study` varchar(255) DEFAULT NULL,
  `start_year` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKaw3ebf3585a1ndgqnk6k6hosc` (`user_id`),
  CONSTRAINT `FKaw3ebf3585a1ndgqnk6k6hosc` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `education`
--

LOCK TABLES `education` WRITE;
/*!40000 ALTER TABLE `education` DISABLE KEYS */;
INSERT INTO `education` VALUES (2,'cvr college of engineering','titile',NULL,'',NULL,6);
INSERT INTO `education` VALUES (3,'Stanford University','Master\'s',2022,'Computer Science',2020,22);
/*!40000 ALTER TABLE `education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experience`
--

DROP TABLE IF EXISTS `experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experience` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `company` varchar(255) DEFAULT NULL,
  `description` text,
  `employment_type` varchar(255) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK41lup37auw1bvwwqpgn0blbic` (`user_id`),
  CONSTRAINT `FK41lup37auw1bvwwqpgn0blbic` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experience`
--

LOCK TABLES `experience` WRITE;
/*!40000 ALTER TABLE `experience` DISABLE KEYS */;
INSERT INTO `experience` VALUES (3,'hhhh','','sujith',NULL,NULL,'hhhh',6);
INSERT INTO `experience` VALUES (4,'Google','','Full-time',NULL,'2023-01-01','Software Engineer',22);
/*!40000 ALTER TABLE `experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_preferences`
--

DROP TABLE IF EXISTS `job_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_preferences` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `employment_types` varchar(255) DEFAULT NULL,
  `expected_salary` varchar(255) DEFAULT NULL,
  `job_titles` text,
  `location_types` varchar(255) DEFAULT NULL,
  `locations` text,
  `notice_period` varchar(255) DEFAULT NULL,
  `start_date` varchar(255) DEFAULT NULL,
  `visibility` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKfagb5a31yykk99x6kk3hum1hh` (`user_id`),
  CONSTRAINT `FK9whxrdg9fqt185wldwrgv134f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKt7uwvymgpbvap0vuj244vmhtg` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_preferences`
--

LOCK TABLES `job_preferences` WRITE;
/*!40000 ALTER TABLE `job_preferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `receiver_email` varchar(255) DEFAULT NULL,
  `sender_email` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `receiver_email` varchar(255) DEFAULT NULL,
  `sender_email` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `author_email` varchar(255) DEFAULT NULL,
  `content` text,
  `created_at` datetime(6) DEFAULT NULL,
  `author_name` varchar(255) DEFAULT NULL,
  `media_urls` text,
  `repost_of_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (10,'hemanth2@gmail.com','hiii guys its me','2026-03-07 15:17:07.555920','hemanth2','[\"/uploads/f4bef389-17b9-454e-97b7-f2ff97bfda84.jpg\"]',NULL);
INSERT INTO `post` VALUES (11,'hemanth2@gmail.com','hello linkup','2026-03-07 15:17:19.820044','hemanth2',NULL,NULL);
INSERT INTO `post` VALUES (12,'hemanth2@gmail.com','hello world','2026-03-07 15:17:43.423719','hemanth2','[\"/uploads/5748ca29-7742-4bda-9c80-e10c57ab3b8d.jpeg\"]',NULL);
INSERT INTO `post` VALUES (13,'hemanth3@gmail.com','these are my roommates','2026-03-07 15:19:07.398236','hemanth3','[\"/uploads/10e048ca-5dcc-4703-95b8-b65576a52715.mp4\"]',NULL);
INSERT INTO `post` VALUES (14,'hemanth2@gmail.com','multiple meedia','2026-03-07 15:19:59.070476','hemanth2','[\"/uploads/eff7ebdf-da98-4f03-8a6a-d200d7ed2cec.jpg\",\"/uploads/79a8430e-4497-4d08-86a0-254519034940.jpeg\"]',NULL);
INSERT INTO `post` VALUES (15,'hemanth4@gmail.com','','2026-03-07 16:03:25.476087','hemanth4','[\"/uploads/a06f3bc6-4afd-423b-8a70-74d4e1ed1d86.jpg\"]',NULL);
INSERT INTO `post` VALUES (16,'hemanth@gmail.com','huuu','2026-03-08 19:40:26.112609','Hemanth','[\"/uploads/abaca815-17ac-430e-b8e8-42964b00b1d7.jpg\"]',NULL);
INSERT INTO `post` VALUES (17,'hemanth@gmail.com','','2026-03-08 21:01:12.481733','Hemanth',NULL,12);
INSERT INTO `post` VALUES (18,'hemanth@gmail.com','','2026-03-08 21:01:13.236058','Hemanth',NULL,12);
INSERT INTO `post` VALUES (19,'hemanth@gmail.com','','2026-03-08 21:01:23.698874','Hemanth',NULL,13);
INSERT INTO `post` VALUES (20,'hemanth@gmail.com','','2026-03-08 21:01:36.642175','Hemanth',NULL,13);
INSERT INTO `post` VALUES (21,'hemanth@gmail.com','','2026-03-08 21:01:42.600002','Hemanth',NULL,16);
INSERT INTO `post` VALUES (22,'hemanth@gmail.com','hi hemanth','2026-03-08 21:01:52.374860','Hemanth',NULL,12);
INSERT INTO `post` VALUES (23,'hemanth@gmail.com','','2026-03-08 21:07:35.160290','Hemanth',NULL,12);
INSERT INTO `post` VALUES (24,'hemanth@gmail.com','','2026-03-08 21:17:03.405048','Hemanth',NULL,13);
INSERT INTO `post` VALUES (25,'hemanth@gmail.com','ohh','2026-03-08 21:17:18.266074','Hemanth',NULL,19);
INSERT INTO `post` VALUES (26,'hemanth@gmail.com','','2026-03-08 21:36:06.839627','Hemanth',NULL,13);
INSERT INTO `post` VALUES (27,'hemanth@gmail.com','','2026-03-09 14:35:06.443083','Hemanth',NULL,14);
INSERT INTO `post` VALUES (28,'hemanth@gmail.com','thank you','2026-03-09 14:35:33.636218','Hemanth',NULL,16);
INSERT INTO `post` VALUES (29,'hemanth@gmail.com','hello everyone','2026-03-09 14:36:09.751063','Hemanth','[\"/uploads/e50c1ff1-c5c8-4eea-b657-d85c5c137a14.jpeg\"]',NULL);
INSERT INTO `post` VALUES (30,'hemanth@gmail.com','','2026-03-09 14:36:19.392357','Hemanth',NULL,29);
INSERT INTO `post` VALUES (31,'hemanth5@gmail.com','hello world','2026-03-09 14:39:13.521914','hemanth5',NULL,NULL);
INSERT INTO `post` VALUES (32,'hemanth5@gmail.com','','2026-03-09 14:49:17.455387','hemanth5',NULL,31);
INSERT INTO `post` VALUES (33,'hemanth4@gmail.com','hi','2026-03-10 21:38:21.062273','hemanth4',NULL,NULL);
INSERT INTO `post` VALUES (34,'hemanth4@gmail.com','','2026-03-16 14:21:23.051488','hemanth4',NULL,33);
INSERT INTO `post` VALUES (35,'hemanth@gmail.com','hello','2026-03-16 15:13:17.096569','Hemanth',NULL,NULL);
INSERT INTO `post` VALUES (36,'hemanth@gmail.com','A common form of Lorem ipsum reads: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.A common form of Lorem ipsum reads: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.A common form of Lorem ipsum reads: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.A common form of Lorem ipsum reads: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.','2026-03-16 15:14:29.151015','Hemanth','[\"/uploads/80d5c105-ba7b-4557-89cd-51d1e0c88b18.png\"]',NULL);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_reactions`
--

DROP TABLE IF EXISTS `post_reactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_reactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `type` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `post_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKdoj5dkpufc2i12y0tdryp8u8y` (`post_id`,`user_email`),
  CONSTRAINT `FK7aa8im6vplpp1ndineboq9jyg` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_reactions`
--

LOCK TABLES `post_reactions` WRITE;
/*!40000 ALTER TABLE `post_reactions` DISABLE KEYS */;
INSERT INTO `post_reactions` VALUES (2,'2026-03-07 15:23:00.156879','LIKE','2026-03-07 15:23:00.156879','hemanth3@gmail.com','hemanth3',13);
INSERT INTO `post_reactions` VALUES (4,'2026-03-07 15:27:00.306686','LIKE','2026-03-07 15:27:16.073838','hemanth3@gmail.com','hemanth3',14);
INSERT INTO `post_reactions` VALUES (5,'2026-03-07 15:34:06.365304','LIKE','2026-03-07 15:34:06.365304','hemanth2@gmail.com','hemanth2',14);
INSERT INTO `post_reactions` VALUES (6,'2026-03-07 15:34:14.169669','CELEBRATE','2026-03-07 15:34:23.857014','hemanth2@gmail.com','hemanth2',13);
INSERT INTO `post_reactions` VALUES (7,'2026-03-07 15:34:17.778208','SUPPORT','2026-03-07 15:34:17.778208','hemanth2@gmail.com','hemanth2',12);
INSERT INTO `post_reactions` VALUES (8,'2026-03-07 15:34:21.057312','LIKE','2026-03-07 15:34:21.057312','hemanth2@gmail.com','hemanth2',11);
INSERT INTO `post_reactions` VALUES (10,'2026-03-07 15:34:54.803796','LIKE','2026-03-07 15:34:54.803796','hemanth2@gmail.com','hemanth2',10);
INSERT INTO `post_reactions` VALUES (11,'2026-03-07 16:02:43.172987','LIKE','2026-03-07 16:02:43.172987','hemanth4@gmail.com','hemanth4',14);
INSERT INTO `post_reactions` VALUES (12,'2026-03-07 16:02:53.386092','LOVE','2026-03-07 16:02:53.386092','hemanth4@gmail.com','hemanth4',13);
INSERT INTO `post_reactions` VALUES (13,'2026-03-07 16:02:56.603429','LIKE','2026-03-07 16:02:56.603429','hemanth4@gmail.com','hemanth4',12);
INSERT INTO `post_reactions` VALUES (14,'2026-03-07 16:02:58.385016','LIKE','2026-03-07 16:02:58.385016','hemanth4@gmail.com','hemanth4',11);
INSERT INTO `post_reactions` VALUES (15,'2026-03-07 16:03:00.077682','LIKE','2026-03-07 16:03:00.077682','hemanth4@gmail.com','hemanth4',10);
INSERT INTO `post_reactions` VALUES (16,'2026-03-07 16:03:28.886378','LIKE','2026-03-07 16:03:28.886378','hemanth4@gmail.com','hemanth4',15);
INSERT INTO `post_reactions` VALUES (17,'2026-03-07 16:03:47.394775','LIKE','2026-03-07 16:03:47.394775','hemanth3@gmail.com','hemanth3',15);
INSERT INTO `post_reactions` VALUES (18,'2026-03-08 19:35:16.763035','LIKE','2026-03-08 19:35:16.763035','hemanth@gmail.com','Hemanth',15);
INSERT INTO `post_reactions` VALUES (19,'2026-03-08 19:36:22.533869','LIKE','2026-03-08 19:36:22.533869','hemanth@gmail.com','Hemanth',14);
INSERT INTO `post_reactions` VALUES (20,'2026-03-08 19:36:25.339953','CELEBRATE','2026-03-08 19:36:25.339953','hemanth@gmail.com','Hemanth',13);
INSERT INTO `post_reactions` VALUES (21,'2026-03-08 19:36:27.898864','LOVE','2026-03-08 19:36:27.898864','hemanth@gmail.com','Hemanth',12);
INSERT INTO `post_reactions` VALUES (22,'2026-03-08 19:40:30.630337','CELEBRATE','2026-03-08 19:40:31.967737','hemanth@gmail.com','Hemanth',16);
INSERT INTO `post_reactions` VALUES (23,'2026-03-08 19:46:22.672062','LIKE','2026-03-08 19:46:22.672062','hemanth@gmail.com','Hemanth',11);
INSERT INTO `post_reactions` VALUES (24,'2026-03-08 21:07:25.711023','LIKE','2026-03-08 21:07:25.711023','hemanth@gmail.com','Hemanth',22);
INSERT INTO `post_reactions` VALUES (25,'2026-03-08 21:10:34.953442','LIKE','2026-03-08 21:10:34.953442','hemanth@gmail.com','Hemanth',23);
INSERT INTO `post_reactions` VALUES (26,'2026-03-08 21:16:59.056661','LIKE','2026-03-08 21:16:59.056661','hemanth@gmail.com','Hemanth',19);
INSERT INTO `post_reactions` VALUES (27,'2026-03-08 21:19:31.755035','LIKE','2026-03-08 21:19:31.755035','hemanth@gmail.com','Hemanth',25);
INSERT INTO `post_reactions` VALUES (28,'2026-03-09 14:34:09.479036','LOVE','2026-03-09 14:34:18.169376','hemanth@gmail.com','Hemanth',26);
INSERT INTO `post_reactions` VALUES (29,'2026-03-09 14:36:14.725339','LIKE','2026-03-09 14:36:14.725339','hemanth@gmail.com','Hemanth',29);
INSERT INTO `post_reactions` VALUES (30,'2026-03-09 14:39:17.163410','LIKE','2026-03-09 14:39:17.163410','hemanth5@gmail.com','hemanth5',30);
INSERT INTO `post_reactions` VALUES (31,'2026-03-09 14:39:23.496203','LIKE','2026-03-09 14:39:23.496203','hemanth5@gmail.com','hemanth5',31);
INSERT INTO `post_reactions` VALUES (32,'2026-03-10 14:14:58.209922','LIKE','2026-03-10 14:14:58.209922','hemanth5@gmail.com','hemanth5',32);
INSERT INTO `post_reactions` VALUES (33,'2026-03-10 21:37:59.452100','LIKE','2026-03-10 21:37:59.452100','hemanth4@gmail.com','hemanth4',25);
INSERT INTO `post_reactions` VALUES (34,'2026-03-10 21:40:03.924201','LOVE','2026-03-10 21:40:06.708224','hemanth4@gmail.com','hemanth4',33);
INSERT INTO `post_reactions` VALUES (35,'2026-03-10 23:06:04.239503','LIKE','2026-03-10 23:06:04.239503','hemanth@gmail.com','Hemanth',33);
INSERT INTO `post_reactions` VALUES (36,'2026-03-16 14:21:17.564311','LIKE','2026-03-16 14:21:17.564311','hemanth4@gmail.com','hemanth4',32);
INSERT INTO `post_reactions` VALUES (37,'2026-03-16 15:14:36.095286','CELEBRATE','2026-03-16 15:14:36.095286','hemanth@gmail.com','Hemanth',36);
INSERT INTO `post_reactions` VALUES (38,'2026-03-17 13:39:16.783182','LIKE','2026-03-17 13:39:16.783182','hemanth4@gmail.com','hemanth4',36);
INSERT INTO `post_reactions` VALUES (39,'2026-03-17 13:40:07.154222','LIKE','2026-03-17 13:40:07.154222','hemanth4@gmail.com','hemanth4',35);
INSERT INTO `post_reactions` VALUES (40,'2026-03-17 13:40:09.418000','LIKE','2026-03-17 13:40:09.418000','hemanth4@gmail.com','hemanth4',34);
INSERT INTO `post_reactions` VALUES (41,'2026-03-17 13:40:13.637482','LIKE','2026-03-17 13:40:13.637482','hemanth4@gmail.com','hemanth4',31);
INSERT INTO `post_reactions` VALUES (42,'2026-03-17 13:40:17.666519','SUPPORT','2026-03-17 13:40:17.666519','hemanth4@gmail.com','hemanth4',30);
INSERT INTO `post_reactions` VALUES (43,'2026-03-17 13:40:25.423501','LOVE','2026-03-17 13:40:32.823683','hemanth4@gmail.com','hemanth4',29);
/*!40000 ALTER TABLE `post_reactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_analytics`
--

DROP TABLE IF EXISTS `profile_analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_analytics` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `post_impressions` bigint DEFAULT NULL,
  `profile_views` bigint DEFAULT NULL,
  `search_appearances` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK9rj3xhsmjdqm6bh8a4hisyrde` (`user_id`),
  CONSTRAINT `FKp1u9w5kqbksmynwbui6q0mot3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKr4aj2773balwv0pebilqbl14p` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_analytics`
--

LOCK TABLES `profile_analytics` WRITE;
/*!40000 ALTER TABLE `profile_analytics` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skill`
--

DROP TABLE IF EXISTS `skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skill` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK5ljf2l2h4odhtxrsuohlro4ir` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skill`
--

LOCK TABLES `skill` WRITE;
/*!40000 ALTER TABLE `skill` DISABLE KEYS */;
INSERT INTO `skill` VALUES (6,'html');
INSERT INTO `skill` VALUES (2,'java');
INSERT INTO `skill` VALUES (3,'java ');
INSERT INTO `skill` VALUES (4,'python');
INSERT INTO `skill` VALUES (5,'React');
INSERT INTO `skill` VALUES (1,'titile');
/*!40000 ALTER TABLE `skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_skill`
--

DROP TABLE IF EXISTS `user_skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_skill` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `skill_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKj53flyds4vknyh8llw5d7jdop` (`skill_id`),
  KEY `FKfixgsonf2ev168mfck7co17u1` (`user_id`),
  CONSTRAINT `FKfixgsonf2ev168mfck7co17u1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKj53flyds4vknyh8llw5d7jdop` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_skill`
--

LOCK TABLES `user_skill` WRITE;
/*!40000 ALTER TABLE `user_skill` DISABLE KEYS */;
INSERT INTO `user_skill` VALUES (6,5,6);
INSERT INTO `user_skill` VALUES (7,6,6);
INSERT INTO `user_skill` VALUES (8,2,6);
/*!40000 ALTER TABLE `user_skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `headline` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `about` text,
  `college` varchar(255) DEFAULT NULL,
  `connections_count` int DEFAULT NULL,
  `cover_picture` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'hemanth@gmail.com','Software Engineer','India','Hemanth','$2a$10$oPUQK2lobnooI5a6fT784uxW.xjhya1jwOpabfsD99roRNAhcIgy6','hello','',NULL,NULL,NULL,NULL);
INSERT INTO `users` VALUES (13,'hemanth4@gmail.com',NULL,'india','hemanth4','$2a$10$u5Pg5Yyfr/NbAOQlhPriQOtiYrXcuYbpIZK8SUdGKOfV3cpk5s9Au',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO `users` VALUES (14,'hemanth1@gmail.com',NULL,NULL,'hemanth1','$2a$10$o.U.PxgQRVmHbhGOGiJwe.fF99kdoHlZnf4wwyT1B3H2xkdlP/ScO',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO `users` VALUES (15,'hemanth2@gmail.com',NULL,NULL,'hemanth2','$2a$10$D6RfNlLB4PGVancw.SrnPObFq5zFoE0y1xdEHvPdNWD9HYzFyDN62',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO `users` VALUES (16,'hemanth3@gmail.com',NULL,NULL,'hemanth3','$2a$10$Q1rLT.qYCOrq6S5fZmgCqujb3ZRyalvK1cYQAR.3Ee8Qf72q7NJHe',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO `users` VALUES (17,'hemanth5@gmail.com',NULL,NULL,'hemanth5','$2a$10$atMthsrmkQYJAz6GKBnD9.0nG.M9MSvKtKz4Yt1QH1qYpGee8x0ha',NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO `users` VALUES (19,'sujithraj@gmail.com',NULL,NULL,'sujithraj','$2a$10$CrTBjILLwqGIcXs5CPgigeE0M3.VXUiVOpfNKFLDfbdYM.Oc2EwjO',NULL,NULL,0,NULL,'2026-03-10 14:07:54.009043',NULL);
INSERT INTO `users` VALUES (20,'test2@example.com',NULL,NULL,'Test User',NULL,NULL,NULL,0,NULL,'2026-03-10 21:32:40.969492',NULL);
INSERT INTO `users` VALUES (21,'test3@example.com',NULL,NULL,'Test User 3','$2a$10$BS6I7rKEh3iXDldm9Kd0AuHKHS6FJCOp5jn7Wj6HzLvIidJ7tQCbq',NULL,NULL,0,NULL,'2026-03-10 21:35:33.331699',NULL);
INSERT INTO `users` VALUES (22,'test@example.com',NULL,'New York','Test User','$2a$10$ciymlyWCeS.dmQi0f9.wfex9XFu7FfWzgXiO/HaFUVZGVcthchE92',NULL,NULL,0,NULL,'2026-03-16 14:37:15.561458',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-23 15:10:27
