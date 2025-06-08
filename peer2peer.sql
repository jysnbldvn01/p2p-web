-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 08, 2025 at 11:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `peer2peer`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `avatar`) VALUES
(1, 'Jayson Rod Jalmasco', 'jysnbldvn@gmail.com', '$2b$10$r3qHdiNZm8yQL4waS/c7WuJbb.3563U6sgbBhSvXWiJjOLxG3PYsK', 'user', '2025-06-01 03:30:08', NULL),
(8, 'Jayson Rod baldovino', 'jysnbldvn02@gmail.com', '$2b$10$WCmoMfGbg/h2mBQSDLATM./4FIAhIJamsxshbVrwol0.q48n5YTTC', 'user', '2025-06-02 06:40:40', NULL),
(9, 'jayson', 'clementcruz0314@gmail.com', '$2b$10$VWoFkku7byB4PE4XUT/8/emzDjiHwS4Z3L1Kq3HvNEpSSjy3EF23K', 'user', '2025-06-03 15:18:58', NULL),
(10, 'Justine Rod Jalmasco', 'jysnbldvn12@gamail.com', '$2b$10$H2ssO15KaxLKBibXELy9Xu0QTiyiUtL1nzO592Zf5JamAAUoWu1kG', 'user', '2025-06-08 03:33:03', NULL),
(11, 'Jayson Rod Jalmasco', 'jysnbldvn1@gamail.com', '$2b$10$FMp79NUrbrgupffCZaSCOOTKxvH71cfEjITQ7BstxdEQAjShA4fIy', 'user', '2025-06-08 03:41:45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `profile_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `social_links` text DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_profiles`
--

INSERT INTO `user_profiles` (`profile_id`, `user_id`, `username`, `skills`, `bio`, `birthday`, `gender`, `social_links`, `contact_number`, `created_at`, `avatar`) VALUES
(1, 11, 'zaura213', 'Business Strat', 'Just a Living organism', '2003-12-18', 'Male', 'N/A', '09192627904', '2025-06-08 03:57:46', 'avatar_1749355967665.png'),
(2, 9, 'zaura2134', 'Marketing Strategy, Business Development, GTA Cheats', 'Just A Living Organism', '2003-12-16', 'Female', 'https://www.facebook.com/jysn.bldvn', '09192627904', '2025-06-08 04:19:17', 'avatar_1749370446429.jpg'),
(3, 10, 'Jayson Baldovino', 'Marketing Strategy, Business Development, GTA Cheats', 'Hi, I’m Jayson, an aspiring entrepreneur passionate about technology-driven solutions that create real value for people. ', '2003-12-19', 'Male', 'https://animekai.to/home', '09192627904', '2025-06-08 09:18:26', 'avatar_1749374306550.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`profile_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `profile_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
