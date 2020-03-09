-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 06. Mrz 2020 um 11:59
-- Server-Version: 10.1.38-MariaDB
-- PHP-Version: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `quizfight`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `questions`
--

CREATE TABLE `questions` (
  `qid` int(11) NOT NULL,
  `text` text COLLATE utf16_bin NOT NULL,
  `answer0` text COLLATE utf16_bin NOT NULL,
  `answer1` text COLLATE utf16_bin NOT NULL,
  `answer2` text COLLATE utf16_bin,
  `answer3` text COLLATE utf16_bin,
  `rightanswer` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_bin;

--
-- Daten für Tabelle `questions`
--

INSERT INTO `questions` (`qid`, `text`, `answer0`, `answer1`, `answer2`, `answer3`, `rightanswer`) VALUES
(1, 'Wie heißt die Antwort auf die Frage nach dem Leben, dem Universium und dem ganzen Rest?', '21', '23', '42', '43', 2),
(2, 'Wer entwickelte den ersten funktionsfähigen Computer der Welt?', 'IBM', 'Zuse', 'Apple', 'von Neumann', 1),
(3, 'Welche Programmiersprache gilt als die erste \"moderne\" Programmiersprache, die bis heute eingesetzt wird?', 'C', 'PASCAL', 'JavaScript', 'Fortran', 3);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`qid`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `questions`
--
ALTER TABLE `questions`
  MODIFY `qid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
