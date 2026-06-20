import type { Player } from '../types';

type HistoricalNBAPlayer = {
  name: string;
  position: Player['position'];
  stats: Player['stats'];
  seasonStats?: Player['stats'][];
  isLegend?: boolean;
  isAllStar?: boolean;
};

export const NBA_CURATED_EXPANSION_ROSTERS: Record<string, HistoricalNBAPlayer[]> = {
  // Mavericks Dirk/Nash Era 2000-2004
  '7-nba-7-2000': [
    { name: 'Dirk Nowitzki', position: 'PF', isLegend: true, stats: { points: 26.6, rebounds: 9.9, assists: 3.0, steals: 1.4, blocks: 1.0, fieldGoalPct: 0.459, threePointPct: 0.398, freeThrowPct: 0.869 } },
    { name: 'Steve Nash', position: 'PG', isLegend: true, stats: { points: 17.9, rebounds: 3.0, assists: 7.7, steals: 1.0, blocks: 0.1, fieldGoalPct: 0.483, threePointPct: 0.455, freeThrowPct: 0.887 } },
    { name: 'Michael Finley', position: 'SG', isAllStar: true, stats: { points: 21.5, rebounds: 5.2, assists: 4.4, steals: 1.4, blocks: 0.4, fieldGoalPct: 0.459, threePointPct: 0.407, freeThrowPct: 0.805 } },
    { name: 'Nick Van Exel', position: 'PG', stats: { points: 12.5, rebounds: 3.0, assists: 4.3, steals: 0.6, blocks: 0.1, fieldGoalPct: 0.412, threePointPct: 0.378, freeThrowPct: 0.764 } },
    { name: 'Antawn Jamison', position: 'SF', isAllStar: true, stats: { points: 14.8, rebounds: 6.3, assists: 0.9, steals: 1.0, blocks: 0.4, fieldGoalPct: 0.535, threePointPct: 0.400, freeThrowPct: 0.748 } },
    { name: 'Josh Howard', position: 'SF', stats: { points: 8.6, rebounds: 5.5, assists: 1.4, steals: 1.0, blocks: 0.8, fieldGoalPct: 0.430, threePointPct: 0.303, freeThrowPct: 0.703 } },
    { name: 'Raef LaFrentz', position: 'C', stats: { points: 9.3, rebounds: 4.8, assists: 0.8, steals: 0.5, blocks: 1.3, fieldGoalPct: 0.518, threePointPct: 0.405, freeThrowPct: 0.682 } },
    { name: 'Shawn Bradley', position: 'C', stats: { points: 6.7, rebounds: 5.9, assists: 0.7, steals: 0.8, blocks: 2.1, fieldGoalPct: 0.536, threePointPct: 0.000, freeThrowPct: 0.806 } },
  ],
  // Mavericks Championship Era 2010-2014
  '7-nba-7-2010': [
    { name: 'Dirk Nowitzki', position: 'PF', isLegend: true, stats: { points: 23.0, rebounds: 7.0, assists: 2.6, steals: 0.5, blocks: 0.6, fieldGoalPct: 0.517, threePointPct: 0.393, freeThrowPct: 0.892 } },
    { name: 'Jason Kidd', position: 'PG', isLegend: true, stats: { points: 7.9, rebounds: 4.4, assists: 8.2, steals: 1.7, blocks: 0.4, fieldGoalPct: 0.361, threePointPct: 0.425, freeThrowPct: 0.870 } },
    { name: 'Jason Terry', position: 'SG', stats: { points: 15.8, rebounds: 1.9, assists: 4.1, steals: 1.1, blocks: 0.2, fieldGoalPct: 0.451, threePointPct: 0.365, freeThrowPct: 0.850 } },
    { name: 'Shawn Marion', position: 'SF', isAllStar: true, stats: { points: 12.5, rebounds: 6.9, assists: 1.4, steals: 0.9, blocks: 0.6, fieldGoalPct: 0.520, threePointPct: 0.152, freeThrowPct: 0.768 } },
    { name: 'Tyson Chandler', position: 'C', isAllStar: true, stats: { points: 10.1, rebounds: 9.4, assists: 0.4, steals: 0.5, blocks: 1.1, fieldGoalPct: 0.654, threePointPct: 0.000, freeThrowPct: 0.732 } },
    { name: 'Caron Butler', position: 'SF', isAllStar: true, stats: { points: 15.0, rebounds: 4.1, assists: 1.6, steals: 1.0, blocks: 0.3, fieldGoalPct: 0.450, threePointPct: 0.431, freeThrowPct: 0.773 } },
    { name: 'J.J. Barea', position: 'PG', stats: { points: 9.5, rebounds: 2.0, assists: 3.9, steals: 0.4, blocks: 0.0, fieldGoalPct: 0.439, threePointPct: 0.349, freeThrowPct: 0.847 } },
    { name: 'Brendan Haywood', position: 'C', stats: { points: 4.4, rebounds: 5.2, assists: 0.3, steals: 0.2, blocks: 1.0, fieldGoalPct: 0.574, threePointPct: 0.000, freeThrowPct: 0.362 } },
  ],

  // Nuggets Melo Era 2005-2009
  '8-nba-8-2005': [
    { name: 'Carmelo Anthony', position: 'SF', isAllStar: true, stats: { points: 28.9, rebounds: 6.0, assists: 3.8, steals: 1.2, blocks: 0.4, fieldGoalPct: 0.481, threePointPct: 0.354, freeThrowPct: 0.808 } },
    { name: 'Allen Iverson', position: 'SG', isLegend: true, stats: { points: 26.4, rebounds: 3.0, assists: 7.1, steals: 2.0, blocks: 0.1, fieldGoalPct: 0.458, threePointPct: 0.345, freeThrowPct: 0.809 } },
    { name: 'Chauncey Billups', position: 'PG', isAllStar: true, stats: { points: 17.9, rebounds: 3.0, assists: 6.4, steals: 1.2, blocks: 0.2, fieldGoalPct: 0.420, threePointPct: 0.410, freeThrowPct: 0.913 } },
    { name: 'Nene', position: 'PF', stats: { points: 14.6, rebounds: 7.8, assists: 1.4, steals: 1.2, blocks: 1.3, fieldGoalPct: 0.604, threePointPct: 0.200, freeThrowPct: 0.723 } },
    { name: 'Marcus Camby', position: 'C', isAllStar: true, stats: { points: 11.2, rebounds: 11.7, assists: 3.2, steals: 1.2, blocks: 3.3, fieldGoalPct: 0.465, threePointPct: 0.091, freeThrowPct: 0.729 } },
    { name: 'Kenyon Martin', position: 'PF', stats: { points: 12.4, rebounds: 7.3, assists: 1.4, steals: 1.2, blocks: 1.1, fieldGoalPct: 0.490, threePointPct: 0.250, freeThrowPct: 0.646 } },
    { name: 'J.R. Smith', position: 'SG', stats: { points: 15.2, rebounds: 3.7, assists: 2.8, steals: 1.0, blocks: 0.2, fieldGoalPct: 0.446, threePointPct: 0.397, freeThrowPct: 0.754 } },
    { name: 'Andre Miller', position: 'PG', stats: { points: 13.7, rebounds: 4.3, assists: 8.2, steals: 1.3, blocks: 0.2, fieldGoalPct: 0.463, threePointPct: 0.185, freeThrowPct: 0.738 } },
  ],

  // Pacers Reggie Miller Era 1995-1999
  '12-nba-12-1995': [
    { name: 'Reggie Miller', position: 'SG', isLegend: true, stats: { points: 21.6, rebounds: 2.9, assists: 3.4, steals: 1.0, blocks: 0.3, fieldGoalPct: 0.476, threePointPct: 0.429, freeThrowPct: 0.904 } },
    { name: 'Mark Jackson', position: 'PG', stats: { points: 7.6, rebounds: 3.8, assists: 8.7, steals: 1.2, blocks: 0.1, fieldGoalPct: 0.409, threePointPct: 0.314, freeThrowPct: 0.823 } },
    { name: 'Rik Smits', position: 'C', isAllStar: true, stats: { points: 18.5, rebounds: 6.9, assists: 1.4, steals: 0.5, blocks: 1.2, fieldGoalPct: 0.521, threePointPct: 0.000, freeThrowPct: 0.788 } },
    { name: 'Dale Davis', position: 'PF', isAllStar: true, stats: { points: 10.0, rebounds: 9.9, assists: 0.9, steals: 0.7, blocks: 1.3, fieldGoalPct: 0.548, threePointPct: 0.000, freeThrowPct: 0.465 } },
    { name: 'Antonio Davis', position: 'PF', isAllStar: true, stats: { points: 11.5, rebounds: 7.1, assists: 0.9, steals: 0.4, blocks: 1.0, fieldGoalPct: 0.471, threePointPct: 0.000, freeThrowPct: 0.703 } },
    { name: 'Chris Mullin', position: 'SF', isLegend: true, stats: { points: 11.3, rebounds: 3.0, assists: 2.3, steals: 1.2, blocks: 0.5, fieldGoalPct: 0.481, threePointPct: 0.440, freeThrowPct: 0.939 } },
    { name: 'Jalen Rose', position: 'SF', stats: { points: 18.2, rebounds: 4.8, assists: 4.0, steals: 1.1, blocks: 0.6, fieldGoalPct: 0.471, threePointPct: 0.393, freeThrowPct: 0.827 } },
    { name: 'Travis Best', position: 'PG', stats: { points: 9.4, rebounds: 2.0, assists: 3.4, steals: 1.0, blocks: 0.1, fieldGoalPct: 0.446, threePointPct: 0.356, freeThrowPct: 0.841 } },
  ],
  // Pacers Paul George Era 2010-2014
  '12-nba-12-2010': [
    { name: 'Paul George', position: 'SF', isAllStar: true, stats: { points: 21.7, rebounds: 6.8, assists: 3.5, steals: 1.9, blocks: 0.3, fieldGoalPct: 0.424, threePointPct: 0.364, freeThrowPct: 0.864 } },
    { name: 'Roy Hibbert', position: 'C', isAllStar: true, stats: { points: 12.8, rebounds: 8.8, assists: 1.7, steals: 0.5, blocks: 2.0, fieldGoalPct: 0.497, threePointPct: 0.000, freeThrowPct: 0.711 } },
    { name: 'David West', position: 'PF', isAllStar: true, stats: { points: 17.1, rebounds: 7.7, assists: 2.9, steals: 1.0, blocks: 0.9, fieldGoalPct: 0.498, threePointPct: 0.211, freeThrowPct: 0.819 } },
    { name: 'George Hill', position: 'PG', stats: { points: 14.2, rebounds: 3.7, assists: 4.7, steals: 1.1, blocks: 0.3, fieldGoalPct: 0.443, threePointPct: 0.368, freeThrowPct: 0.817 } },
    { name: 'Lance Stephenson', position: 'SG', stats: { points: 13.8, rebounds: 7.2, assists: 4.6, steals: 0.7, blocks: 0.1, fieldGoalPct: 0.491, threePointPct: 0.352, freeThrowPct: 0.711 } },
    { name: 'Danny Granger', position: 'SF', isAllStar: true, stats: { points: 20.5, rebounds: 5.4, assists: 2.6, steals: 1.1, blocks: 0.8, fieldGoalPct: 0.425, threePointPct: 0.381, freeThrowPct: 0.848 } },
    { name: 'Tyler Hansbrough', position: 'PF', stats: { points: 11.0, rebounds: 5.2, assists: 0.6, steals: 0.5, blocks: 0.2, fieldGoalPct: 0.465, threePointPct: 0.000, freeThrowPct: 0.779 } },
    { name: 'Darren Collison', position: 'PG', stats: { points: 13.2, rebounds: 2.8, assists: 5.1, steals: 1.1, blocks: 0.2, fieldGoalPct: 0.457, threePointPct: 0.331, freeThrowPct: 0.871 } },
  ],

  // Clippers Lob City 2010-2014
  '13-nba-13-2010': [
    { name: 'Chris Paul', position: 'PG', isLegend: true, stats: { points: 19.1, rebounds: 4.3, assists: 10.7, steals: 2.5, blocks: 0.1, fieldGoalPct: 0.481, threePointPct: 0.371, freeThrowPct: 0.885 } },
    { name: 'Blake Griffin', position: 'PF', isAllStar: true, stats: { points: 24.1, rebounds: 9.5, assists: 3.9, steals: 1.2, blocks: 0.6, fieldGoalPct: 0.528, threePointPct: 0.273, freeThrowPct: 0.715 } },
    { name: 'DeAndre Jordan', position: 'C', isAllStar: true, stats: { points: 11.5, rebounds: 15.0, assists: 0.7, steals: 1.0, blocks: 2.2, fieldGoalPct: 0.710, threePointPct: 0.000, freeThrowPct: 0.397 } },
    { name: 'J.J. Redick', position: 'SG', stats: { points: 16.4, rebounds: 2.1, assists: 1.8, steals: 0.5, blocks: 0.1, fieldGoalPct: 0.477, threePointPct: 0.437, freeThrowPct: 0.901 } },
    { name: 'Jamal Crawford', position: 'SG', stats: { points: 18.6, rebounds: 1.7, assists: 3.2, steals: 0.9, blocks: 0.2, fieldGoalPct: 0.416, threePointPct: 0.361, freeThrowPct: 0.870 } },
    { name: 'Caron Butler', position: 'SF', isAllStar: true, stats: { points: 12.0, rebounds: 3.0, assists: 1.0, steals: 0.7, blocks: 0.1, fieldGoalPct: 0.424, threePointPct: 0.388, freeThrowPct: 0.802 } },
    { name: 'Matt Barnes', position: 'SF', stats: { points: 10.3, rebounds: 4.6, assists: 2.0, steals: 0.9, blocks: 0.5, fieldGoalPct: 0.438, threePointPct: 0.362, freeThrowPct: 0.733 } },
    { name: 'Eric Bledsoe', position: 'PG', stats: { points: 8.5, rebounds: 3.0, assists: 3.1, steals: 1.4, blocks: 0.7, fieldGoalPct: 0.445, threePointPct: 0.397, freeThrowPct: 0.791 } },
  ],
  // Clippers Kawhi and PG Era 2020-2024
  '13-nba-13-2020': [
    { name: 'Kawhi Leonard', position: 'SF', isLegend: true, stats: { points: 27.1, rebounds: 7.1, assists: 4.9, steals: 1.8, blocks: 0.6, fieldGoalPct: 0.512, threePointPct: 0.398, freeThrowPct: 0.885 } },
    { name: 'Paul George', position: 'SF', isAllStar: true, stats: { points: 23.3, rebounds: 6.6, assists: 5.2, steals: 1.5, blocks: 0.4, fieldGoalPct: 0.467, threePointPct: 0.411, freeThrowPct: 0.868 } },
    { name: 'James Harden', position: 'SG', isLegend: true, stats: { points: 16.6, rebounds: 5.1, assists: 8.5, steals: 1.1, blocks: 0.8, fieldGoalPct: 0.428, threePointPct: 0.381, freeThrowPct: 0.878 } },
    { name: 'Ivica Zubac', position: 'C', stats: { points: 11.7, rebounds: 9.2, assists: 1.4, steals: 0.3, blocks: 1.2, fieldGoalPct: 0.649, threePointPct: 0.000, freeThrowPct: 0.723 } },
    { name: 'Norman Powell', position: 'SG', stats: { points: 16.0, rebounds: 2.6, assists: 1.8, steals: 0.8, blocks: 0.3, fieldGoalPct: 0.479, threePointPct: 0.435, freeThrowPct: 0.812 } },
    { name: 'Marcus Morris Sr.', position: 'PF', stats: { points: 13.4, rebounds: 4.4, assists: 1.0, steals: 0.6, blocks: 0.3, fieldGoalPct: 0.473, threePointPct: 0.473, freeThrowPct: 0.820 } },
    { name: 'Reggie Jackson', position: 'PG', stats: { points: 16.8, rebounds: 3.6, assists: 4.8, steals: 0.6, blocks: 0.2, fieldGoalPct: 0.433, threePointPct: 0.408, freeThrowPct: 0.817 } },
    { name: 'Terance Mann', position: 'SF', stats: { points: 10.8, rebounds: 5.2, assists: 2.6, steals: 0.7, blocks: 0.3, fieldGoalPct: 0.509, threePointPct: 0.365, freeThrowPct: 0.780 } },
  ],

  // Grizzlies Grit and Grind 2010-2014
  '15-nba-15-2010': [
    { name: 'Marc Gasol', position: 'C', isLegend: true, stats: { points: 17.4, rebounds: 7.8, assists: 3.8, steals: 0.9, blocks: 1.6, fieldGoalPct: 0.494, threePointPct: 0.176, freeThrowPct: 0.795 } },
    { name: 'Zach Randolph', position: 'PF', isAllStar: true, stats: { points: 20.1, rebounds: 12.2, assists: 2.2, steals: 0.8, blocks: 0.3, fieldGoalPct: 0.503, threePointPct: 0.186, freeThrowPct: 0.758 } },
    { name: 'Mike Conley', position: 'PG', stats: { points: 17.2, rebounds: 2.9, assists: 6.0, steals: 1.5, blocks: 0.2, fieldGoalPct: 0.450, threePointPct: 0.361, freeThrowPct: 0.815 } },
    { name: 'Tony Allen', position: 'SG', stats: { points: 9.8, rebounds: 4.0, assists: 1.4, steals: 1.8, blocks: 0.6, fieldGoalPct: 0.510, threePointPct: 0.174, freeThrowPct: 0.750 } },
    { name: 'Rudy Gay', position: 'SF', stats: { points: 19.8, rebounds: 6.2, assists: 2.8, steals: 1.7, blocks: 1.1, fieldGoalPct: 0.471, threePointPct: 0.396, freeThrowPct: 0.805 } },
    { name: 'O.J. Mayo', position: 'SG', stats: { points: 12.6, rebounds: 3.2, assists: 2.6, steals: 1.1, blocks: 0.3, fieldGoalPct: 0.408, threePointPct: 0.364, freeThrowPct: 0.773 } },
    { name: 'Tayshaun Prince', position: 'SF', stats: { points: 8.8, rebounds: 3.3, assists: 1.4, steals: 0.5, blocks: 0.3, fieldGoalPct: 0.429, threePointPct: 0.366, freeThrowPct: 0.615 } },
    { name: 'Darrell Arthur', position: 'PF', stats: { points: 9.1, rebounds: 4.3, assists: 0.7, steals: 0.7, blocks: 0.8, fieldGoalPct: 0.497, threePointPct: 0.000, freeThrowPct: 0.813 } },
  ],
  // Grizzlies Ja Era 2020-2024
  '15-nba-15-2020': [
    { name: 'Ja Morant', position: 'PG', isAllStar: true, stats: { points: 27.4, rebounds: 5.7, assists: 6.7, steals: 1.2, blocks: 0.4, fieldGoalPct: 0.493, threePointPct: 0.344, freeThrowPct: 0.761 } },
    { name: 'Jaren Jackson Jr.', position: 'PF', isAllStar: true, stats: { points: 22.5, rebounds: 5.5, assists: 2.3, steals: 1.2, blocks: 3.0, fieldGoalPct: 0.488, threePointPct: 0.355, freeThrowPct: 0.788 } },
    { name: 'Desmond Bane', position: 'SG', stats: { points: 23.7, rebounds: 4.4, assists: 5.5, steals: 1.0, blocks: 0.5, fieldGoalPct: 0.464, threePointPct: 0.408, freeThrowPct: 0.883 } },
    { name: 'Dillon Brooks', position: 'SF', stats: { points: 17.2, rebounds: 3.3, assists: 2.3, steals: 1.2, blocks: 0.3, fieldGoalPct: 0.432, threePointPct: 0.344, freeThrowPct: 0.849 } },
    { name: 'Steven Adams', position: 'C', stats: { points: 8.6, rebounds: 11.5, assists: 2.3, steals: 0.9, blocks: 1.1, fieldGoalPct: 0.547, threePointPct: 0.000, freeThrowPct: 0.543 } },
    { name: 'Brandon Clarke', position: 'PF', stats: { points: 12.1, rebounds: 5.9, assists: 1.4, steals: 0.6, blocks: 1.1, fieldGoalPct: 0.656, threePointPct: 0.227, freeThrowPct: 0.723 } },
    { name: 'Tyus Jones', position: 'PG', stats: { points: 10.3, rebounds: 2.5, assists: 5.2, steals: 1.0, blocks: 0.1, fieldGoalPct: 0.459, threePointPct: 0.414, freeThrowPct: 0.818 } },
    { name: 'Jonas Valanciunas', position: 'C', stats: { points: 17.1, rebounds: 12.5, assists: 1.8, steals: 0.6, blocks: 0.9, fieldGoalPct: 0.592, threePointPct: 0.368, freeThrowPct: 0.773 } },
  ],

  // Bucks Moncrief Era 1980-1984
  '17-nba-17-1980': [
    { name: 'Sidney Moncrief', position: 'SG', isLegend: true, stats: { points: 22.5, rebounds: 5.8, assists: 3.9, steals: 1.5, blocks: 0.3, fieldGoalPct: 0.524, threePointPct: 0.100, freeThrowPct: 0.826 } },
    { name: 'Marques Johnson', position: 'SF', isAllStar: true, stats: { points: 21.4, rebounds: 7.0, assists: 4.6, steals: 1.5, blocks: 0.8, fieldGoalPct: 0.532, threePointPct: 0.000, freeThrowPct: 0.700 } },
    { name: 'Junior Bridgeman', position: 'SF', stats: { points: 15.9, rebounds: 3.7, assists: 3.0, steals: 1.1, blocks: 0.3, fieldGoalPct: 0.492, threePointPct: 0.154, freeThrowPct: 0.840 } },
    { name: 'Bob Lanier', position: 'C', isLegend: true, stats: { points: 13.5, rebounds: 5.9, assists: 2.7, steals: 1.0, blocks: 0.8, fieldGoalPct: 0.525, threePointPct: 0.000, freeThrowPct: 0.751 } },
    { name: 'Paul Pressey', position: 'PG', stats: { points: 12.0, rebounds: 5.4, assists: 6.8, steals: 1.6, blocks: 0.6, fieldGoalPct: 0.499, threePointPct: 0.222, freeThrowPct: 0.763 } },
    { name: 'Terry Cummings', position: 'PF', isAllStar: true, stats: { points: 23.6, rebounds: 9.1, assists: 2.9, steals: 1.5, blocks: 0.8, fieldGoalPct: 0.495, threePointPct: 0.000, freeThrowPct: 0.741 } },
    { name: 'Ricky Pierce', position: 'SG', stats: { points: 9.9, rebounds: 2.1, assists: 1.2, steals: 0.5, blocks: 0.2, fieldGoalPct: 0.525, threePointPct: 0.250, freeThrowPct: 0.874 } },
    { name: 'Alton Lister', position: 'C', stats: { points: 8.4, rebounds: 7.9, assists: 1.3, steals: 0.4, blocks: 1.8, fieldGoalPct: 0.532, threePointPct: 0.000, freeThrowPct: 0.568 } },
  ],

  // Timberwolves KG Era 2000-2004
  '18-nba-18-2000': [
    { name: 'Kevin Garnett', position: 'PF', isLegend: true, stats: { points: 24.2, rebounds: 13.9, assists: 5.0, steals: 1.5, blocks: 2.2, fieldGoalPct: 0.499, threePointPct: 0.256, freeThrowPct: 0.791 } },
    { name: 'Sam Cassell', position: 'PG', isAllStar: true, stats: { points: 19.8, rebounds: 3.3, assists: 7.3, steals: 1.3, blocks: 0.2, fieldGoalPct: 0.488, threePointPct: 0.398, freeThrowPct: 0.873 } },
    { name: 'Latrell Sprewell', position: 'SG', isAllStar: true, stats: { points: 16.8, rebounds: 3.8, assists: 3.5, steals: 1.1, blocks: 0.3, fieldGoalPct: 0.409, threePointPct: 0.331, freeThrowPct: 0.814 } },
    { name: 'Wally Szczerbiak', position: 'SF', isAllStar: true, stats: { points: 18.7, rebounds: 4.8, assists: 3.1, steals: 0.8, blocks: 0.3, fieldGoalPct: 0.508, threePointPct: 0.455, freeThrowPct: 0.831 } },
    { name: 'Terrell Brandon', position: 'PG', stats: { points: 16.0, rebounds: 3.3, assists: 7.5, steals: 1.6, blocks: 0.3, fieldGoalPct: 0.451, threePointPct: 0.363, freeThrowPct: 0.871 } },
    { name: 'Anthony Peeler', position: 'SG', stats: { points: 10.8, rebounds: 2.5, assists: 2.4, steals: 1.0, blocks: 0.2, fieldGoalPct: 0.421, threePointPct: 0.392, freeThrowPct: 0.823 } },
    { name: 'Rasho Nesterovic', position: 'C', stats: { points: 11.2, rebounds: 6.5, assists: 1.5, steals: 0.5, blocks: 1.5, fieldGoalPct: 0.525, threePointPct: 0.000, freeThrowPct: 0.642 } },
    { name: 'Troy Hudson', position: 'PG', stats: { points: 14.2, rebounds: 2.2, assists: 5.7, steals: 0.8, blocks: 0.1, fieldGoalPct: 0.401, threePointPct: 0.366, freeThrowPct: 0.880 } },
  ],
  // Timberwolves Edwards Era 2020-2024
  '18-nba-18-2020': [
    { name: 'Anthony Edwards', position: 'SG', isAllStar: true, stats: { points: 26.1, rebounds: 5.7, assists: 5.1, steals: 1.3, blocks: 0.5, fieldGoalPct: 0.461, threePointPct: 0.357, freeThrowPct: 0.836 } },
    { name: 'Karl-Anthony Towns', position: 'C', isAllStar: true, stats: { points: 24.6, rebounds: 9.8, assists: 3.6, steals: 1.0, blocks: 1.1, fieldGoalPct: 0.529, threePointPct: 0.410, freeThrowPct: 0.873 } },
    { name: 'Rudy Gobert', position: 'C', isLegend: true, stats: { points: 14.0, rebounds: 12.9, assists: 1.3, steals: 0.7, blocks: 2.1, fieldGoalPct: 0.661, threePointPct: 0.000, freeThrowPct: 0.638 } },
    { name: "D'Angelo Russell", position: 'PG', isAllStar: true, stats: { points: 19.0, rebounds: 3.1, assists: 7.1, steals: 1.0, blocks: 0.4, fieldGoalPct: 0.456, threePointPct: 0.391, freeThrowPct: 0.757 } },
    { name: 'Mike Conley', position: 'PG', stats: { points: 14.4, rebounds: 3.5, assists: 6.0, steals: 1.4, blocks: 0.2, fieldGoalPct: 0.444, threePointPct: 0.412, freeThrowPct: 0.852 } },
    { name: 'Jaden McDaniels', position: 'SF', stats: { points: 12.1, rebounds: 3.9, assists: 1.9, steals: 0.9, blocks: 1.0, fieldGoalPct: 0.517, threePointPct: 0.398, freeThrowPct: 0.736 } },
    { name: 'Naz Reid', position: 'PF', stats: { points: 13.5, rebounds: 5.2, assists: 1.3, steals: 0.8, blocks: 0.9, fieldGoalPct: 0.477, threePointPct: 0.414, freeThrowPct: 0.736 } },
    { name: 'Malik Beasley', position: 'SG', stats: { points: 19.6, rebounds: 4.4, assists: 2.4, steals: 0.8, blocks: 0.2, fieldGoalPct: 0.440, threePointPct: 0.399, freeThrowPct: 0.850 } },
  ],

  // Pelicans Chris Paul Era 2005-2009
  '19-nba-19-2005': [
    { name: 'Chris Paul', position: 'PG', isLegend: true, stats: { points: 22.8, rebounds: 5.5, assists: 11.0, steals: 2.8, blocks: 0.1, fieldGoalPct: 0.503, threePointPct: 0.364, freeThrowPct: 0.868 } },
    { name: 'David West', position: 'PF', isAllStar: true, stats: { points: 21.0, rebounds: 8.5, assists: 2.3, steals: 0.8, blocks: 0.9, fieldGoalPct: 0.482, threePointPct: 0.240, freeThrowPct: 0.850 } },
    { name: 'Tyson Chandler', position: 'C', isAllStar: true, stats: { points: 11.8, rebounds: 11.7, assists: 1.0, steals: 0.6, blocks: 1.1, fieldGoalPct: 0.623, threePointPct: 0.000, freeThrowPct: 0.593 } },
    { name: 'Peja Stojakovic', position: 'SF', isAllStar: true, stats: { points: 16.4, rebounds: 4.3, assists: 1.2, steals: 0.7, blocks: 0.1, fieldGoalPct: 0.440, threePointPct: 0.441, freeThrowPct: 0.929 } },
    { name: 'Jannero Pargo', position: 'SG', stats: { points: 8.1, rebounds: 1.6, assists: 2.4, steals: 0.6, blocks: 0.1, fieldGoalPct: 0.390, threePointPct: 0.349, freeThrowPct: 0.877 } },
    { name: 'Morris Peterson', position: 'SG', stats: { points: 8.0, rebounds: 2.7, assists: 0.9, steals: 0.6, blocks: 0.1, fieldGoalPct: 0.417, threePointPct: 0.394, freeThrowPct: 0.765 } },
    { name: 'Desmond Mason', position: 'SF', stats: { points: 13.7, rebounds: 4.6, assists: 1.5, steals: 0.8, blocks: 0.3, fieldGoalPct: 0.452, threePointPct: 0.000, freeThrowPct: 0.663 } },
    { name: 'P.J. Brown', position: 'PF', stats: { points: 9.0, rebounds: 7.3, assists: 1.2, steals: 0.7, blocks: 0.7, fieldGoalPct: 0.461, threePointPct: 0.000, freeThrowPct: 0.827 } },
  ],
  // Pelicans Zion Era 2020-2024
  '19-nba-19-2020': [
    { name: 'Zion Williamson', position: 'PF', isAllStar: true, stats: { points: 27.0, rebounds: 7.2, assists: 3.7, steals: 0.9, blocks: 0.6, fieldGoalPct: 0.611, threePointPct: 0.294, freeThrowPct: 0.698 } },
    { name: 'Brandon Ingram', position: 'SF', isAllStar: true, stats: { points: 24.7, rebounds: 5.8, assists: 5.6, steals: 0.7, blocks: 0.6, fieldGoalPct: 0.484, threePointPct: 0.390, freeThrowPct: 0.826 } },
    { name: 'CJ McCollum', position: 'SG', stats: { points: 24.3, rebounds: 4.3, assists: 4.5, steals: 1.1, blocks: 0.3, fieldGoalPct: 0.458, threePointPct: 0.388, freeThrowPct: 0.812 } },
    { name: 'Lonzo Ball', position: 'PG', stats: { points: 14.6, rebounds: 4.8, assists: 5.7, steals: 1.5, blocks: 0.6, fieldGoalPct: 0.414, threePointPct: 0.378, freeThrowPct: 0.781 } },
    { name: 'Jonas Valanciunas', position: 'C', stats: { points: 17.8, rebounds: 11.4, assists: 2.6, steals: 0.6, blocks: 0.8, fieldGoalPct: 0.544, threePointPct: 0.361, freeThrowPct: 0.820 } },
    { name: 'Herb Jones', position: 'SF', stats: { points: 11.0, rebounds: 3.6, assists: 2.6, steals: 1.7, blocks: 0.8, fieldGoalPct: 0.498, threePointPct: 0.418, freeThrowPct: 0.867 } },
    { name: 'Trey Murphy III', position: 'SF', stats: { points: 14.8, rebounds: 4.9, assists: 2.2, steals: 1.1, blocks: 0.5, fieldGoalPct: 0.443, threePointPct: 0.406, freeThrowPct: 0.905 } },
    { name: 'Jose Alvarado', position: 'PG', stats: { points: 9.0, rebounds: 2.3, assists: 3.0, steals: 1.1, blocks: 0.2, fieldGoalPct: 0.411, threePointPct: 0.377, freeThrowPct: 0.813 } },
  ],

  // Knicks Ewing Era 1990-1994
  '20-nba-20-1990': [
    { name: 'Patrick Ewing', position: 'C', isLegend: true, stats: { points: 26.6, rebounds: 11.2, assists: 1.9, steals: 1.1, blocks: 3.0, fieldGoalPct: 0.514, threePointPct: 0.000, freeThrowPct: 0.745 } },
    { name: 'John Starks', position: 'SG', isAllStar: true, stats: { points: 19.0, rebounds: 2.7, assists: 5.9, steals: 1.6, blocks: 0.1, fieldGoalPct: 0.420, threePointPct: 0.355, freeThrowPct: 0.754 } },
    { name: 'Charles Oakley', position: 'PF', isAllStar: true, stats: { points: 10.8, rebounds: 11.8, assists: 2.7, steals: 1.3, blocks: 0.2, fieldGoalPct: 0.517, threePointPct: 0.000, freeThrowPct: 0.761 } },
    { name: 'Mark Jackson', position: 'PG', isAllStar: true, stats: { points: 13.8, rebounds: 3.8, assists: 10.6, steals: 1.2, blocks: 0.1, fieldGoalPct: 0.492, threePointPct: 0.255, freeThrowPct: 0.731 } },
    { name: 'Anthony Mason', position: 'SF', isAllStar: true, stats: { points: 9.9, rebounds: 8.4, assists: 3.1, steals: 0.9, blocks: 0.3, fieldGoalPct: 0.566, threePointPct: 0.000, freeThrowPct: 0.641 } },
    { name: 'Derek Harper', position: 'PG', stats: { points: 15.3, rebounds: 2.4, assists: 4.4, steals: 1.9, blocks: 0.2, fieldGoalPct: 0.426, threePointPct: 0.289, freeThrowPct: 0.756 } },
    { name: 'Charles Smith', position: 'SF', stats: { points: 14.6, rebounds: 5.6, assists: 1.5, steals: 0.7, blocks: 1.6, fieldGoalPct: 0.469, threePointPct: 0.227, freeThrowPct: 0.793 } },
    { name: 'Doc Rivers', position: 'PG', stats: { points: 7.8, rebounds: 2.5, assists: 5.3, steals: 1.6, blocks: 0.1, fieldGoalPct: 0.437, threePointPct: 0.317, freeThrowPct: 0.821 } },
  ],
  // Knicks Melo Era 2010-2014
  '20-nba-20-2010': [
    { name: 'Carmelo Anthony', position: 'SF', isAllStar: true, stats: { points: 28.7, rebounds: 6.9, assists: 2.6, steals: 0.8, blocks: 0.5, fieldGoalPct: 0.449, threePointPct: 0.379, freeThrowPct: 0.830 } },
    { name: "Amar'e Stoudemire", position: 'PF', isAllStar: true, stats: { points: 25.3, rebounds: 8.2, assists: 2.6, steals: 0.9, blocks: 1.9, fieldGoalPct: 0.502, threePointPct: 0.435, freeThrowPct: 0.792 } },
    { name: 'Tyson Chandler', position: 'C', isAllStar: true, stats: { points: 11.3, rebounds: 10.1, assists: 0.9, steals: 0.6, blocks: 1.4, fieldGoalPct: 0.679, threePointPct: 0.000, freeThrowPct: 0.689 } },
    { name: 'J.R. Smith', position: 'SG', stats: { points: 18.1, rebounds: 5.3, assists: 2.7, steals: 1.3, blocks: 0.3, fieldGoalPct: 0.422, threePointPct: 0.356, freeThrowPct: 0.762 } },
    { name: 'Raymond Felton', position: 'PG', stats: { points: 17.1, rebounds: 3.6, assists: 9.0, steals: 1.8, blocks: 0.2, fieldGoalPct: 0.423, threePointPct: 0.328, freeThrowPct: 0.867 } },
    { name: 'Jeremy Lin', position: 'PG', stats: { points: 14.6, rebounds: 3.1, assists: 6.2, steals: 1.6, blocks: 0.3, fieldGoalPct: 0.446, threePointPct: 0.320, freeThrowPct: 0.798 } },
    { name: 'Iman Shumpert', position: 'SG', stats: { points: 9.5, rebounds: 3.2, assists: 2.8, steals: 1.7, blocks: 0.1, fieldGoalPct: 0.401, threePointPct: 0.306, freeThrowPct: 0.798 } },
    { name: 'Steve Novak', position: 'SF', stats: { points: 8.8, rebounds: 1.9, assists: 0.2, steals: 0.3, blocks: 0.2, fieldGoalPct: 0.478, threePointPct: 0.472, freeThrowPct: 0.846 } },
  ],

  // Thunder/Sonics Payton and Kemp Era 1995-1999
  '21-nba-21-1995': [
    { name: 'Gary Payton', position: 'PG', isLegend: true, stats: { points: 21.8, rebounds: 4.6, assists: 7.1, steals: 2.4, blocks: 0.2, fieldGoalPct: 0.484, threePointPct: 0.328, freeThrowPct: 0.748 } },
    { name: 'Shawn Kemp', position: 'PF', isAllStar: true, stats: { points: 19.6, rebounds: 11.4, assists: 2.2, steals: 1.2, blocks: 1.6, fieldGoalPct: 0.561, threePointPct: 0.417, freeThrowPct: 0.742 } },
    { name: 'Detlef Schrempf', position: 'SF', isAllStar: true, stats: { points: 19.2, rebounds: 6.2, assists: 4.0, steals: 1.0, blocks: 0.2, fieldGoalPct: 0.486, threePointPct: 0.408, freeThrowPct: 0.839 } },
    { name: 'Hersey Hawkins', position: 'SG', isAllStar: true, stats: { points: 15.6, rebounds: 3.9, assists: 2.6, steals: 1.8, blocks: 0.2, fieldGoalPct: 0.473, threePointPct: 0.384, freeThrowPct: 0.874 } },
    { name: 'Sam Perkins', position: 'C', stats: { points: 11.8, rebounds: 4.5, assists: 1.5, steals: 0.9, blocks: 0.7, fieldGoalPct: 0.408, threePointPct: 0.355, freeThrowPct: 0.817 } },
    { name: 'Nate McMillan', position: 'PG', stats: { points: 5.2, rebounds: 4.1, assists: 5.3, steals: 2.1, blocks: 0.5, fieldGoalPct: 0.422, threePointPct: 0.343, freeThrowPct: 0.630 } },
    { name: 'Vin Baker', position: 'PF', isAllStar: true, stats: { points: 19.2, rebounds: 8.0, assists: 1.9, steals: 1.1, blocks: 1.0, fieldGoalPct: 0.542, threePointPct: 0.000, freeThrowPct: 0.591 } },
    { name: 'Ervin Johnson', position: 'C', stats: { points: 5.1, rebounds: 6.5, assists: 0.4, steals: 0.6, blocks: 1.2, fieldGoalPct: 0.511, threePointPct: 0.000, freeThrowPct: 0.594 } },
  ],
  // Thunder Durant-Westbrook Era 2010-2014
  '21-nba-21-2010': [
    { name: 'Kevin Durant', position: 'SF', isLegend: true, stats: { points: 32.0, rebounds: 7.4, assists: 5.5, steals: 1.3, blocks: 0.7, fieldGoalPct: 0.503, threePointPct: 0.391, freeThrowPct: 0.873 } },
    { name: 'Russell Westbrook', position: 'PG', isAllStar: true, stats: { points: 23.2, rebounds: 5.2, assists: 7.4, steals: 1.8, blocks: 0.3, fieldGoalPct: 0.457, threePointPct: 0.330, freeThrowPct: 0.823 } },
    { name: 'James Harden', position: 'SG', isLegend: true, stats: { points: 16.8, rebounds: 4.1, assists: 3.7, steals: 1.0, blocks: 0.2, fieldGoalPct: 0.491, threePointPct: 0.390, freeThrowPct: 0.846 } },
    { name: 'Serge Ibaka', position: 'PF', isAllStar: true, stats: { points: 15.1, rebounds: 8.8, assists: 1.0, steals: 0.5, blocks: 3.0, fieldGoalPct: 0.573, threePointPct: 0.383, freeThrowPct: 0.749 } },
    { name: 'Kendrick Perkins', position: 'C', stats: { points: 5.1, rebounds: 6.6, assists: 1.2, steals: 0.4, blocks: 1.1, fieldGoalPct: 0.489, threePointPct: 0.000, freeThrowPct: 0.611 } },
    { name: 'Reggie Jackson', position: 'PG', stats: { points: 13.1, rebounds: 3.9, assists: 4.1, steals: 1.1, blocks: 0.1, fieldGoalPct: 0.440, threePointPct: 0.339, freeThrowPct: 0.893 } },
    { name: 'Thabo Sefolosha', position: 'SG', stats: { points: 6.7, rebounds: 4.0, assists: 1.5, steals: 1.3, blocks: 0.5, fieldGoalPct: 0.419, threePointPct: 0.419, freeThrowPct: 0.826 } },
    { name: 'Nick Collison', position: 'PF', stats: { points: 4.6, rebounds: 4.3, assists: 1.3, steals: 0.5, blocks: 0.4, fieldGoalPct: 0.589, threePointPct: 0.000, freeThrowPct: 0.692 } },
  ],

  // Magic Shaq and Penny Era 1995-1999
  '22-nba-22-1995': [
    { name: "Shaquille O'Neal", position: 'C', isLegend: true, stats: { points: 29.3, rebounds: 11.4, assists: 2.7, steals: 0.9, blocks: 2.4, fieldGoalPct: 0.573, threePointPct: 0.500, freeThrowPct: 0.487 } },
    { name: 'Penny Hardaway', position: 'PG', isAllStar: true, stats: { points: 21.7, rebounds: 4.3, assists: 7.1, steals: 2.0, blocks: 0.5, fieldGoalPct: 0.513, threePointPct: 0.314, freeThrowPct: 0.767 } },
    { name: 'Nick Anderson', position: 'SG', stats: { points: 15.8, rebounds: 5.4, assists: 4.8, steals: 1.6, blocks: 0.5, fieldGoalPct: 0.476, threePointPct: 0.415, freeThrowPct: 0.704 } },
    { name: 'Dennis Scott', position: 'SF', stats: { points: 17.5, rebounds: 3.8, assists: 3.0, steals: 1.1, blocks: 0.3, fieldGoalPct: 0.440, threePointPct: 0.425, freeThrowPct: 0.820 } },
    { name: 'Horace Grant', position: 'PF', isAllStar: true, stats: { points: 13.4, rebounds: 9.2, assists: 2.4, steals: 1.0, blocks: 1.2, fieldGoalPct: 0.567, threePointPct: 0.000, freeThrowPct: 0.692 } },
    { name: 'Brian Shaw', position: 'PG', stats: { points: 6.6, rebounds: 3.5, assists: 3.8, steals: 0.9, blocks: 0.3, fieldGoalPct: 0.417, threePointPct: 0.347, freeThrowPct: 0.782 } },
    { name: 'Darrell Armstrong', position: 'PG', stats: { points: 13.8, rebounds: 3.6, assists: 6.7, steals: 2.2, blocks: 0.1, fieldGoalPct: 0.433, threePointPct: 0.365, freeThrowPct: 0.904 } },
    { name: 'Bo Outlaw', position: 'PF', stats: { points: 7.0, rebounds: 7.8, assists: 2.8, steals: 1.3, blocks: 1.8, fieldGoalPct: 0.554, threePointPct: 0.000, freeThrowPct: 0.549 } },
  ],
  // Magic Dwight Era 2005-2009
  '22-nba-22-2005': [
    { name: 'Dwight Howard', position: 'C', isLegend: true, stats: { points: 20.6, rebounds: 13.8, assists: 1.4, steals: 0.9, blocks: 2.9, fieldGoalPct: 0.612, threePointPct: 0.000, freeThrowPct: 0.594 } },
    { name: 'Jameer Nelson', position: 'PG', isAllStar: true, stats: { points: 16.7, rebounds: 3.5, assists: 5.4, steals: 1.2, blocks: 0.1, fieldGoalPct: 0.503, threePointPct: 0.453, freeThrowPct: 0.887 } },
    { name: 'Rashard Lewis', position: 'PF', isAllStar: true, stats: { points: 18.2, rebounds: 5.7, assists: 2.6, steals: 1.0, blocks: 0.6, fieldGoalPct: 0.455, threePointPct: 0.409, freeThrowPct: 0.838 } },
    { name: 'Hedo Turkoglu', position: 'SF', stats: { points: 19.5, rebounds: 5.7, assists: 5.0, steals: 0.9, blocks: 0.3, fieldGoalPct: 0.456, threePointPct: 0.400, freeThrowPct: 0.829 } },
    { name: 'J.J. Redick', position: 'SG', stats: { points: 9.6, rebounds: 1.9, assists: 1.9, steals: 0.3, blocks: 0.1, fieldGoalPct: 0.440, threePointPct: 0.397, freeThrowPct: 0.860 } },
    { name: 'Rafer Alston', position: 'PG', stats: { points: 12.0, rebounds: 2.9, assists: 5.1, steals: 1.4, blocks: 0.1, fieldGoalPct: 0.413, threePointPct: 0.317, freeThrowPct: 0.707 } },
    { name: 'Mickael Pietrus', position: 'SF', stats: { points: 9.4, rebounds: 3.3, assists: 0.6, steals: 0.6, blocks: 0.4, fieldGoalPct: 0.413, threePointPct: 0.359, freeThrowPct: 0.709 } },
    { name: 'Marcin Gortat', position: 'C', stats: { points: 3.8, rebounds: 4.5, assists: 0.2, steals: 0.3, blocks: 0.8, fieldGoalPct: 0.569, threePointPct: 0.000, freeThrowPct: 0.578 } },
  ],

  // 76ers Iverson Era 2000-2004
  '23-nba-23-2000': [
    { name: 'Allen Iverson', position: 'SG', isLegend: true, stats: { points: 31.4, rebounds: 4.5, assists: 5.5, steals: 2.8, blocks: 0.2, fieldGoalPct: 0.420, threePointPct: 0.320, freeThrowPct: 0.814 } },
    { name: 'Dikembe Mutombo', position: 'C', isLegend: true, stats: { points: 11.7, rebounds: 12.4, assists: 1.0, steals: 0.4, blocks: 2.5, fieldGoalPct: 0.484, threePointPct: 0.000, freeThrowPct: 0.725 } },
    { name: 'Eric Snow', position: 'PG', stats: { points: 12.9, rebounds: 3.7, assists: 6.6, steals: 1.6, blocks: 0.1, fieldGoalPct: 0.452, threePointPct: 0.219, freeThrowPct: 0.858 } },
    { name: 'Aaron McKie', position: 'SG', stats: { points: 11.6, rebounds: 4.1, assists: 5.0, steals: 1.4, blocks: 0.1, fieldGoalPct: 0.473, threePointPct: 0.312, freeThrowPct: 0.768 } },
    { name: 'Theo Ratliff', position: 'C', isAllStar: true, stats: { points: 12.4, rebounds: 8.3, assists: 1.2, steals: 0.6, blocks: 3.7, fieldGoalPct: 0.499, threePointPct: 0.000, freeThrowPct: 0.760 } },
    { name: 'Andre Iguodala', position: 'SF', isAllStar: true, stats: { points: 9.0, rebounds: 5.7, assists: 3.0, steals: 1.7, blocks: 0.6, fieldGoalPct: 0.493, threePointPct: 0.331, freeThrowPct: 0.743 } },
    { name: 'Kyle Korver', position: 'SF', stats: { points: 11.5, rebounds: 4.6, assists: 2.2, steals: 1.3, blocks: 0.4, fieldGoalPct: 0.418, threePointPct: 0.405, freeThrowPct: 0.854 } },
    { name: 'Kenny Thomas', position: 'PF', stats: { points: 10.2, rebounds: 8.3, assists: 1.9, steals: 1.0, blocks: 0.4, fieldGoalPct: 0.469, threePointPct: 0.222, freeThrowPct: 0.752 } },
  ],

  // Suns Barkley Era 1990-1994
  '24-nba-24-1990': [
    { name: 'Charles Barkley', position: 'PF', isLegend: true, stats: { points: 25.6, rebounds: 12.2, assists: 5.1, steals: 1.6, blocks: 1.0, fieldGoalPct: 0.520, threePointPct: 0.305, freeThrowPct: 0.765 } },
    { name: 'Kevin Johnson', position: 'PG', isAllStar: true, stats: { points: 20.1, rebounds: 3.6, assists: 10.7, steals: 1.5, blocks: 0.3, fieldGoalPct: 0.499, threePointPct: 0.205, freeThrowPct: 0.838 } },
    { name: 'Dan Majerle', position: 'SG', isAllStar: true, stats: { points: 17.3, rebounds: 5.9, assists: 3.8, steals: 1.7, blocks: 0.4, fieldGoalPct: 0.464, threePointPct: 0.381, freeThrowPct: 0.778 } },
    { name: 'Tom Chambers', position: 'PF', isAllStar: true, stats: { points: 19.9, rebounds: 6.4, assists: 2.1, steals: 0.7, blocks: 0.7, fieldGoalPct: 0.431, threePointPct: 0.367, freeThrowPct: 0.830 } },
    { name: 'Cedric Ceballos', position: 'SF', stats: { points: 21.7, rebounds: 8.0, assists: 1.8, steals: 1.0, blocks: 0.4, fieldGoalPct: 0.535, threePointPct: 0.335, freeThrowPct: 0.666 } },
    { name: 'Danny Manning', position: 'SF', isAllStar: true, stats: { points: 17.9, rebounds: 6.0, assists: 3.3, steals: 1.4, blocks: 1.2, fieldGoalPct: 0.547, threePointPct: 0.286, freeThrowPct: 0.755 } },
    { name: 'Oliver Miller', position: 'C', stats: { points: 9.2, rebounds: 6.9, assists: 2.3, steals: 1.0, blocks: 1.9, fieldGoalPct: 0.558, threePointPct: 0.000, freeThrowPct: 0.710 } },
    { name: 'A.C. Green', position: 'PF', stats: { points: 11.2, rebounds: 8.2, assists: 1.5, steals: 0.7, blocks: 0.4, fieldGoalPct: 0.502, threePointPct: 0.229, freeThrowPct: 0.735 } },
  ],

  // Trail Blazers Clyde Era 1990-1994
  '25-nba-25-1990': [
    { name: 'Clyde Drexler', position: 'SG', isLegend: true, stats: { points: 25.0, rebounds: 6.7, assists: 6.0, steals: 1.8, blocks: 0.7, fieldGoalPct: 0.470, threePointPct: 0.337, freeThrowPct: 0.794 } },
    { name: 'Terry Porter', position: 'PG', isAllStar: true, stats: { points: 18.2, rebounds: 3.1, assists: 8.0, steals: 1.6, blocks: 0.1, fieldGoalPct: 0.515, threePointPct: 0.415, freeThrowPct: 0.823 } },
    { name: 'Clifford Robinson', position: 'PF', isAllStar: true, stats: { points: 19.1, rebounds: 6.6, assists: 2.2, steals: 1.2, blocks: 1.2, fieldGoalPct: 0.452, threePointPct: 0.371, freeThrowPct: 0.694 } },
    { name: 'Jerome Kersey', position: 'SF', stats: { points: 16.6, rebounds: 8.0, assists: 3.2, steals: 1.5, blocks: 0.8, fieldGoalPct: 0.465, threePointPct: 0.259, freeThrowPct: 0.724 } },
    { name: 'Kevin Duckworth', position: 'C', isAllStar: true, stats: { points: 15.8, rebounds: 6.2, assists: 1.2, steals: 0.5, blocks: 0.5, fieldGoalPct: 0.473, threePointPct: 0.000, freeThrowPct: 0.785 } },
    { name: 'Buck Williams', position: 'PF', isAllStar: true, stats: { points: 13.6, rebounds: 9.8, assists: 1.4, steals: 0.8, blocks: 0.5, fieldGoalPct: 0.602, threePointPct: 0.000, freeThrowPct: 0.665 } },
    { name: 'Danny Ainge', position: 'SG', isAllStar: true, stats: { points: 11.1, rebounds: 2.7, assists: 3.3, steals: 0.9, blocks: 0.1, fieldGoalPct: 0.472, threePointPct: 0.406, freeThrowPct: 0.826 } },
    { name: 'Rod Strickland', position: 'PG', stats: { points: 17.2, rebounds: 4.5, assists: 8.6, steals: 1.8, blocks: 0.3, fieldGoalPct: 0.474, threePointPct: 0.188, freeThrowPct: 0.681 } },
  ],
  // Trail Blazers Lillard Era 2010-2014
  '25-nba-25-2010': [
    { name: 'Damian Lillard', position: 'PG', isAllStar: true, stats: { points: 20.7, rebounds: 3.5, assists: 6.1, steals: 0.9, blocks: 0.3, fieldGoalPct: 0.429, threePointPct: 0.394, freeThrowPct: 0.864 } },
    { name: 'LaMarcus Aldridge', position: 'PF', isAllStar: true, stats: { points: 23.4, rebounds: 10.2, assists: 1.7, steals: 0.7, blocks: 1.0, fieldGoalPct: 0.458, threePointPct: 0.200, freeThrowPct: 0.822 } },
    { name: 'Wesley Matthews', position: 'SG', stats: { points: 16.4, rebounds: 3.5, assists: 2.4, steals: 1.3, blocks: 0.2, fieldGoalPct: 0.441, threePointPct: 0.393, freeThrowPct: 0.837 } },
    { name: 'Nicolas Batum', position: 'SF', stats: { points: 14.3, rebounds: 5.6, assists: 4.9, steals: 1.2, blocks: 0.7, fieldGoalPct: 0.451, threePointPct: 0.361, freeThrowPct: 0.841 } },
    { name: 'CJ McCollum', position: 'SG', stats: { points: 6.8, rebounds: 1.5, assists: 1.0, steals: 0.7, blocks: 0.1, fieldGoalPct: 0.436, threePointPct: 0.375, freeThrowPct: 0.699 } },
    { name: 'Robin Lopez', position: 'C', stats: { points: 11.1, rebounds: 8.5, assists: 0.9, steals: 0.3, blocks: 1.7, fieldGoalPct: 0.551, threePointPct: 0.000, freeThrowPct: 0.818 } },
    { name: 'Gerald Wallace', position: 'SF', isAllStar: true, stats: { points: 13.3, rebounds: 6.6, assists: 2.7, steals: 1.5, blocks: 0.6, fieldGoalPct: 0.454, threePointPct: 0.371, freeThrowPct: 0.767 } },
    { name: 'Andre Miller', position: 'PG', stats: { points: 13.9, rebounds: 3.7, assists: 7.0, steals: 1.4, blocks: 0.1, fieldGoalPct: 0.445, threePointPct: 0.152, freeThrowPct: 0.821 } },
  ],

  // Kings Webber Era 2000-2004
  '26-nba-26-2000': [
    { name: 'Chris Webber', position: 'PF', isAllStar: true, stats: { points: 27.1, rebounds: 11.1, assists: 4.2, steals: 1.3, blocks: 1.7, fieldGoalPct: 0.481, threePointPct: 0.071, freeThrowPct: 0.703 } },
    { name: 'Mike Bibby', position: 'PG', stats: { points: 18.4, rebounds: 3.4, assists: 5.4, steals: 1.4, blocks: 0.2, fieldGoalPct: 0.453, threePointPct: 0.370, freeThrowPct: 0.803 } },
    { name: 'Peja Stojakovic', position: 'SF', isAllStar: true, stats: { points: 24.2, rebounds: 6.3, assists: 2.1, steals: 1.3, blocks: 0.2, fieldGoalPct: 0.480, threePointPct: 0.433, freeThrowPct: 0.927 } },
    { name: 'Vlade Divac', position: 'C', isAllStar: true, stats: { points: 12.0, rebounds: 8.3, assists: 3.7, steals: 1.0, blocks: 1.2, fieldGoalPct: 0.482, threePointPct: 0.286, freeThrowPct: 0.691 } },
    { name: 'Doug Christie', position: 'SG', stats: { points: 12.3, rebounds: 4.6, assists: 4.2, steals: 2.3, blocks: 0.5, fieldGoalPct: 0.442, threePointPct: 0.395, freeThrowPct: 0.897 } },
    { name: 'Bobby Jackson', position: 'PG', stats: { points: 15.2, rebounds: 3.7, assists: 3.1, steals: 1.2, blocks: 0.1, fieldGoalPct: 0.464, threePointPct: 0.379, freeThrowPct: 0.846 } },
    { name: 'Hedo Turkoglu', position: 'SF', stats: { points: 10.1, rebounds: 4.5, assists: 2.0, steals: 0.7, blocks: 0.4, fieldGoalPct: 0.422, threePointPct: 0.368, freeThrowPct: 0.726 } },
    { name: 'Brad Miller', position: 'C', isAllStar: true, stats: { points: 14.1, rebounds: 10.3, assists: 4.3, steals: 0.9, blocks: 1.2, fieldGoalPct: 0.510, threePointPct: 0.316, freeThrowPct: 0.778 } },
  ],
  // Kings Beam Era 2020-2024
  '26-nba-26-2020': [
    { name: "De'Aaron Fox", position: 'PG', isAllStar: true, stats: { points: 26.6, rebounds: 4.6, assists: 5.6, steals: 2.0, blocks: 0.4, fieldGoalPct: 0.465, threePointPct: 0.369, freeThrowPct: 0.738 } },
    { name: 'Domantas Sabonis', position: 'C', isAllStar: true, stats: { points: 19.1, rebounds: 13.7, assists: 8.2, steals: 0.9, blocks: 0.6, fieldGoalPct: 0.594, threePointPct: 0.379, freeThrowPct: 0.704 } },
    { name: 'Tyrese Haliburton', position: 'PG', isAllStar: true, stats: { points: 14.3, rebounds: 3.9, assists: 7.4, steals: 1.7, blocks: 0.7, fieldGoalPct: 0.457, threePointPct: 0.413, freeThrowPct: 0.826 } },
    { name: 'Harrison Barnes', position: 'SF', stats: { points: 16.1, rebounds: 6.6, assists: 3.5, steals: 0.7, blocks: 0.2, fieldGoalPct: 0.497, threePointPct: 0.391, freeThrowPct: 0.830 } },
    { name: 'Keegan Murray', position: 'PF', stats: { points: 15.2, rebounds: 5.5, assists: 1.7, steals: 1.0, blocks: 0.8, fieldGoalPct: 0.454, threePointPct: 0.411, freeThrowPct: 0.831 } },
    { name: 'Malik Monk', position: 'SG', stats: { points: 15.4, rebounds: 2.9, assists: 5.1, steals: 0.6, blocks: 0.5, fieldGoalPct: 0.443, threePointPct: 0.350, freeThrowPct: 0.829 } },
    { name: 'Kevin Huerter', position: 'SG', stats: { points: 15.2, rebounds: 3.3, assists: 2.9, steals: 1.1, blocks: 0.3, fieldGoalPct: 0.485, threePointPct: 0.402, freeThrowPct: 0.725 } },
    { name: 'Richaun Holmes', position: 'C', stats: { points: 14.2, rebounds: 8.3, assists: 1.7, steals: 0.6, blocks: 1.6, fieldGoalPct: 0.637, threePointPct: 0.182, freeThrowPct: 0.794 } },
  ],

  // Raptors Bosh Era 2005-2009
  '28-nba-28-2005': [
    { name: 'Chris Bosh', position: 'PF', isLegend: true, stats: { points: 24.0, rebounds: 10.8, assists: 2.4, steals: 0.6, blocks: 1.0, fieldGoalPct: 0.518, threePointPct: 0.364, freeThrowPct: 0.797 } },
    { name: 'Jose Calderon', position: 'PG', stats: { points: 12.8, rebounds: 2.9, assists: 8.9, steals: 1.1, blocks: 0.1, fieldGoalPct: 0.497, threePointPct: 0.406, freeThrowPct: 0.981 } },
    { name: 'Andrea Bargnani', position: 'C', stats: { points: 17.2, rebounds: 6.2, assists: 1.2, steals: 0.3, blocks: 1.4, fieldGoalPct: 0.470, threePointPct: 0.409, freeThrowPct: 0.831 } },
    { name: 'T.J. Ford', position: 'PG', stats: { points: 14.0, rebounds: 3.1, assists: 7.9, steals: 1.3, blocks: 0.1, fieldGoalPct: 0.436, threePointPct: 0.304, freeThrowPct: 0.819 } },
    { name: 'Anthony Parker', position: 'SG', stats: { points: 12.4, rebounds: 4.1, assists: 2.2, steals: 1.0, blocks: 0.2, fieldGoalPct: 0.477, threePointPct: 0.438, freeThrowPct: 0.835 } },
    { name: 'Morris Peterson', position: 'SF', stats: { points: 16.8, rebounds: 4.6, assists: 2.3, steals: 1.3, blocks: 0.2, fieldGoalPct: 0.395, threePointPct: 0.365, freeThrowPct: 0.820 } },
    { name: 'Jorge Garbajosa', position: 'PF', stats: { points: 8.5, rebounds: 4.9, assists: 1.9, steals: 1.2, blocks: 0.2, fieldGoalPct: 0.420, threePointPct: 0.342, freeThrowPct: 0.731 } },
    { name: 'Jamario Moon', position: 'SF', stats: { points: 8.5, rebounds: 6.2, assists: 1.2, steals: 1.0, blocks: 1.4, fieldGoalPct: 0.485, threePointPct: 0.328, freeThrowPct: 0.741 } },
  ],

  // Jazz Stockton-Malone II 1990-1994
  '29-nba-29-1990': [
    { name: 'Karl Malone', position: 'PF', isLegend: true, stats: { points: 29.0, rebounds: 11.8, assists: 3.3, steals: 1.5, blocks: 1.0, fieldGoalPct: 0.527, threePointPct: 0.286, freeThrowPct: 0.770 } },
    { name: 'John Stockton', position: 'PG', isLegend: true, stats: { points: 17.2, rebounds: 2.9, assists: 14.5, steals: 2.7, blocks: 0.2, fieldGoalPct: 0.507, threePointPct: 0.345, freeThrowPct: 0.836 } },
    { name: 'Jeff Hornacek', position: 'SG', isAllStar: true, stats: { points: 16.5, rebounds: 2.6, assists: 4.3, steals: 1.6, blocks: 0.2, fieldGoalPct: 0.514, threePointPct: 0.429, freeThrowPct: 0.882 } },
    { name: 'Jeff Malone', position: 'SG', isAllStar: true, stats: { points: 20.2, rebounds: 2.7, assists: 2.2, steals: 0.6, blocks: 0.1, fieldGoalPct: 0.508, threePointPct: 0.267, freeThrowPct: 0.825 } },
    { name: 'Mark Eaton', position: 'C', isAllStar: true, stats: { points: 5.1, rebounds: 6.1, assists: 0.5, steals: 0.3, blocks: 2.5, fieldGoalPct: 0.446, threePointPct: 0.000, freeThrowPct: 0.598 } },
    { name: 'Tyrone Corbin', position: 'SF', stats: { points: 11.6, rebounds: 6.2, assists: 1.8, steals: 1.3, blocks: 0.3, fieldGoalPct: 0.491, threePointPct: 0.221, freeThrowPct: 0.789 } },
    { name: 'Blue Edwards', position: 'SF', stats: { points: 12.6, rebounds: 3.8, assists: 1.6, steals: 0.8, blocks: 0.5, fieldGoalPct: 0.483, threePointPct: 0.365, freeThrowPct: 0.763 } },
    { name: 'Felton Spencer', position: 'C', stats: { points: 6.2, rebounds: 5.4, assists: 0.5, steals: 0.4, blocks: 0.8, fieldGoalPct: 0.510, threePointPct: 0.000, freeThrowPct: 0.620 } },
  ],

  // Wizards Bullets Champions 1975-1979
  '30-nba-30-1975': [
    { name: 'Elvin Hayes', position: 'PF', isLegend: true, stats: { points: 23.7, rebounds: 12.5, assists: 1.9, steals: 1.1, blocks: 2.7, fieldGoalPct: 0.501, threePointPct: 0.000, freeThrowPct: 0.687 } },
    { name: 'Wes Unseld', position: 'C', isLegend: true, stats: { points: 7.6, rebounds: 11.9, assists: 4.1, steals: 0.8, blocks: 0.6, fieldGoalPct: 0.523, threePointPct: 0.000, freeThrowPct: 0.538 } },
    { name: 'Phil Chenier', position: 'SG', isAllStar: true, stats: { points: 21.9, rebounds: 3.7, assists: 3.2, steals: 1.8, blocks: 0.7, fieldGoalPct: 0.464, threePointPct: 0.000, freeThrowPct: 0.819 } },
    { name: 'Bob Dandridge', position: 'SF', isAllStar: true, stats: { points: 20.4, rebounds: 5.7, assists: 3.7, steals: 1.4, blocks: 0.7, fieldGoalPct: 0.504, threePointPct: 0.000, freeThrowPct: 0.790 } },
    { name: 'Kevin Porter', position: 'PG', stats: { points: 14.1, rebounds: 2.6, assists: 10.2, steals: 2.0, blocks: 0.1, fieldGoalPct: 0.476, threePointPct: 0.000, freeThrowPct: 0.767 } },
    { name: 'Mitch Kupchak', position: 'C', stats: { points: 15.9, rebounds: 6.9, assists: 1.4, steals: 0.4, blocks: 0.4, fieldGoalPct: 0.489, threePointPct: 0.000, freeThrowPct: 0.801 } },
    { name: 'Greg Ballard', position: 'SF', stats: { points: 7.9, rebounds: 5.5, assists: 1.5, steals: 0.7, blocks: 0.3, fieldGoalPct: 0.469, threePointPct: 0.000, freeThrowPct: 0.755 } },
    { name: 'Tom Henderson', position: 'PG', stats: { points: 9.5, rebounds: 2.4, assists: 4.2, steals: 1.0, blocks: 0.1, fieldGoalPct: 0.440, threePointPct: 0.000, freeThrowPct: 0.722 } },
  ],
  // Wizards Arenas Era 2005-2009
  '30-nba-30-2005': [
    { name: 'Gilbert Arenas', position: 'PG', isAllStar: true, stats: { points: 29.3, rebounds: 3.5, assists: 6.1, steals: 2.0, blocks: 0.3, fieldGoalPct: 0.447, threePointPct: 0.369, freeThrowPct: 0.820 } },
    { name: 'Antawn Jamison', position: 'PF', isAllStar: true, stats: { points: 22.2, rebounds: 8.9, assists: 1.9, steals: 1.1, blocks: 0.3, fieldGoalPct: 0.442, threePointPct: 0.368, freeThrowPct: 0.731 } },
    { name: 'Caron Butler', position: 'SF', isAllStar: true, stats: { points: 20.8, rebounds: 6.2, assists: 4.3, steals: 2.2, blocks: 0.3, fieldGoalPct: 0.466, threePointPct: 0.357, freeThrowPct: 0.901 } },
    { name: 'Brendan Haywood', position: 'C', stats: { points: 10.6, rebounds: 7.2, assists: 0.9, steals: 0.4, blocks: 1.7, fieldGoalPct: 0.528, threePointPct: 0.000, freeThrowPct: 0.735 } },
    { name: 'Antonio Daniels', position: 'PG', stats: { points: 9.6, rebounds: 2.2, assists: 3.6, steals: 0.5, blocks: 0.1, fieldGoalPct: 0.459, threePointPct: 0.230, freeThrowPct: 0.845 } },
    { name: 'DeShawn Stevenson', position: 'SG', stats: { points: 11.2, rebounds: 2.9, assists: 3.1, steals: 0.8, blocks: 0.2, fieldGoalPct: 0.386, threePointPct: 0.383, freeThrowPct: 0.797 } },
    { name: 'Etan Thomas', position: 'C', stats: { points: 6.1, rebounds: 5.8, assists: 0.4, steals: 0.3, blocks: 1.4, fieldGoalPct: 0.574, threePointPct: 0.000, freeThrowPct: 0.558 } },
    { name: 'Larry Hughes', position: 'SG', stats: { points: 22.0, rebounds: 6.3, assists: 4.7, steals: 2.9, blocks: 0.3, fieldGoalPct: 0.430, threePointPct: 0.282, freeThrowPct: 0.777 } },
  ],
};
