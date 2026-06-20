import type { Player } from '../types';

type HistoricalNBAPlayer = {
  name: string;
  position: Player['position'];
  stats: Player['stats'];
  seasonStats?: Player['stats'][];
  isLegend?: boolean;
  isAllStar?: boolean;
};

export const NBA_FRANCHISE_DEPTH_ROSTERS: Record<string, HistoricalNBAPlayer[]> = {
  // Celtics Cowens/Havlicek Era 1975-1979
  '2-nba-2-1975': [
    { name: 'Dave Cowens', position: 'C', isLegend: true, stats: { points: 19.0, rebounds: 14.0, assists: 4.6, steals: 1.3, blocks: 0.9, fieldGoalPct: 0.468, threePointPct: 0.000, freeThrowPct: 0.756 } },
    { name: 'John Havlicek', position: 'SF', isLegend: true, stats: { points: 17.0, rebounds: 4.1, assists: 4.0, steals: 1.3, blocks: 0.3, fieldGoalPct: 0.450, threePointPct: 0.000, freeThrowPct: 0.844 } },
    { name: 'Jo Jo White', position: 'PG', isLegend: true, stats: { points: 18.4, rebounds: 3.8, assists: 5.4, steals: 1.2, blocks: 0.2, fieldGoalPct: 0.440, threePointPct: 0.000, freeThrowPct: 0.830 } },
    { name: 'Charlie Scott', position: 'SG', isAllStar: true, stats: { points: 17.6, rebounds: 3.6, assists: 4.4, steals: 1.3, blocks: 0.3, fieldGoalPct: 0.430, threePointPct: 0.000, freeThrowPct: 0.820 } },
    { name: 'Paul Silas', position: 'PF', stats: { points: 8.2, rebounds: 10.7, assists: 2.5, steals: 0.7, blocks: 0.3, fieldGoalPct: 0.426, threePointPct: 0.000, freeThrowPct: 0.700 } },
    { name: 'Don Nelson', position: 'SF', stats: { points: 9.1, rebounds: 4.1, assists: 1.7, steals: 0.5, blocks: 0.2, fieldGoalPct: 0.484, threePointPct: 0.000, freeThrowPct: 0.764 } },
  ],
  // Celtics Reggie Lewis Era 1990-1994
  '2-nba-2-1990': [
    { name: 'Reggie Lewis', position: 'SG', isAllStar: true, stats: { points: 20.8, rebounds: 4.3, assists: 3.7, steals: 1.5, blocks: 1.3, fieldGoalPct: 0.488, threePointPct: 0.267, freeThrowPct: 0.867 } },
    { name: 'Larry Bird', position: 'SF', isLegend: true, stats: { points: 20.2, rebounds: 9.6, assists: 6.8, steals: 0.9, blocks: 0.7, fieldGoalPct: 0.454, threePointPct: 0.389, freeThrowPct: 0.891 } },
    { name: 'Kevin McHale', position: 'PF', isLegend: true, stats: { points: 18.4, rebounds: 7.1, assists: 1.9, steals: 0.4, blocks: 1.9, fieldGoalPct: 0.553, threePointPct: 0.405, freeThrowPct: 0.829 } },
    { name: 'Robert Parish', position: 'C', isLegend: true, stats: { points: 14.9, rebounds: 10.6, assists: 0.8, steals: 0.8, blocks: 1.3, fieldGoalPct: 0.535, threePointPct: 0.000, freeThrowPct: 0.772 } },
    { name: 'Dee Brown', position: 'PG', stats: { points: 11.6, rebounds: 2.6, assists: 4.0, steals: 1.4, blocks: 0.3, fieldGoalPct: 0.464, threePointPct: 0.329, freeThrowPct: 0.873 } },
    { name: 'Brian Shaw', position: 'PG', stats: { points: 13.8, rebounds: 4.7, assists: 7.6, steals: 1.3, blocks: 0.3, fieldGoalPct: 0.433, threePointPct: 0.294, freeThrowPct: 0.801 } },
  ],
  // Celtics Tatum/Brown Era 2020-2024
  '2-nba-2-2020': [
    { name: 'Jayson Tatum', position: 'SF', isAllStar: true, stats: { points: 30.1, rebounds: 8.8, assists: 4.6, steals: 1.1, blocks: 0.7, fieldGoalPct: 0.466, threePointPct: 0.350, freeThrowPct: 0.854 } },
    { name: 'Jaylen Brown', position: 'SG', isAllStar: true, stats: { points: 26.6, rebounds: 6.9, assists: 3.5, steals: 1.1, blocks: 0.4, fieldGoalPct: 0.491, threePointPct: 0.335, freeThrowPct: 0.765 } },
    { name: 'Kristaps Porzingis', position: 'C', isAllStar: true, stats: { points: 20.1, rebounds: 7.2, assists: 2.0, steals: 0.7, blocks: 1.9, fieldGoalPct: 0.516, threePointPct: 0.375, freeThrowPct: 0.858 } },
    { name: 'Marcus Smart', position: 'PG', stats: { points: 13.1, rebounds: 3.8, assists: 5.7, steals: 1.7, blocks: 0.3, fieldGoalPct: 0.418, threePointPct: 0.336, freeThrowPct: 0.793 } },
    { name: 'Derrick White', position: 'PG', stats: { points: 15.2, rebounds: 4.2, assists: 5.2, steals: 1.0, blocks: 1.2, fieldGoalPct: 0.461, threePointPct: 0.396, freeThrowPct: 0.901 } },
    { name: 'Al Horford', position: 'PF', stats: { points: 10.2, rebounds: 7.7, assists: 3.4, steals: 0.6, blocks: 1.3, fieldGoalPct: 0.467, threePointPct: 0.446, freeThrowPct: 0.842 } },
  ],

  // Hornets LaMelo Era 2020-2024
  '4-nba-4-2020': [
    { name: 'LaMelo Ball', position: 'PG', isAllStar: true, stats: { points: 23.9, rebounds: 5.1, assists: 8.0, steals: 1.6, blocks: 0.3, fieldGoalPct: 0.433, threePointPct: 0.376, freeThrowPct: 0.836 } },
    { name: 'Terry Rozier', position: 'SG', stats: { points: 23.2, rebounds: 3.9, assists: 6.6, steals: 1.1, blocks: 0.3, fieldGoalPct: 0.459, threePointPct: 0.358, freeThrowPct: 0.845 } },
    { name: 'Miles Bridges', position: 'SF', stats: { points: 20.2, rebounds: 7.0, assists: 3.8, steals: 0.9, blocks: 0.6, fieldGoalPct: 0.491, threePointPct: 0.331, freeThrowPct: 0.802 } },
    { name: 'P.J. Washington', position: 'PF', stats: { points: 15.7, rebounds: 5.7, assists: 2.4, steals: 0.9, blocks: 1.1, fieldGoalPct: 0.444, threePointPct: 0.348, freeThrowPct: 0.730 } },
    { name: 'Mark Williams', position: 'C', stats: { points: 12.7, rebounds: 9.7, assists: 1.2, steals: 0.8, blocks: 1.1, fieldGoalPct: 0.637, threePointPct: 0.000, freeThrowPct: 0.691 } },
    { name: 'Gordon Hayward', position: 'SF', isAllStar: true, stats: { points: 19.6, rebounds: 5.9, assists: 4.1, steals: 1.2, blocks: 0.3, fieldGoalPct: 0.473, threePointPct: 0.415, freeThrowPct: 0.843 } },
  ],

  // Bulls Artis Gilmore Era 1975-1979
  '5-nba-5-1975': [
    { name: 'Artis Gilmore', position: 'C', isLegend: true, stats: { points: 23.7, rebounds: 12.7, assists: 3.3, steals: 0.7, blocks: 2.4, fieldGoalPct: 0.575, threePointPct: 0.000, freeThrowPct: 0.739 } },
    { name: 'Reggie Theus', position: 'SG', isAllStar: true, stats: { points: 16.3, rebounds: 2.8, assists: 5.2, steals: 1.4, blocks: 0.2, fieldGoalPct: 0.459, threePointPct: 0.171, freeThrowPct: 0.791 } },
    { name: 'Norm Van Lier', position: 'PG', isAllStar: true, stats: { points: 11.2, rebounds: 4.7, assists: 6.9, steals: 2.0, blocks: 0.2, fieldGoalPct: 0.415, threePointPct: 0.000, freeThrowPct: 0.812 } },
    { name: 'Mickey Johnson', position: 'PF', stats: { points: 16.3, rebounds: 8.4, assists: 3.2, steals: 1.3, blocks: 1.2, fieldGoalPct: 0.472, threePointPct: 0.000, freeThrowPct: 0.739 } },
    { name: 'Scott May', position: 'SF', stats: { points: 14.2, rebounds: 6.1, assists: 1.7, steals: 0.9, blocks: 0.3, fieldGoalPct: 0.455, threePointPct: 0.000, freeThrowPct: 0.790 } },
    { name: 'Wilbur Holland', position: 'PG', stats: { points: 12.7, rebounds: 2.5, assists: 4.2, steals: 1.4, blocks: 0.1, fieldGoalPct: 0.448, threePointPct: 0.000, freeThrowPct: 0.793 } },
  ],

  // Mavericks Aguirre Era 1990-1994
  '7-nba-7-1990': [
    { name: 'Rolando Blackman', position: 'SG', isAllStar: true, stats: { points: 19.9, rebounds: 3.2, assists: 3.5, steals: 0.8, blocks: 0.2, fieldGoalPct: 0.498, threePointPct: 0.321, freeThrowPct: 0.854 } },
    { name: 'Derek Harper', position: 'PG', stats: { points: 19.7, rebounds: 3.0, assists: 7.1, steals: 1.9, blocks: 0.3, fieldGoalPct: 0.443, threePointPct: 0.363, freeThrowPct: 0.794 } },
    { name: 'Jamal Mashburn', position: 'SF', isAllStar: true, stats: { points: 24.1, rebounds: 4.5, assists: 3.4, steals: 1.1, blocks: 0.2, fieldGoalPct: 0.436, threePointPct: 0.363, freeThrowPct: 0.739 } },
    { name: 'Sam Perkins', position: 'PF', stats: { points: 14.7, rebounds: 7.4, assists: 1.6, steals: 0.8, blocks: 0.8, fieldGoalPct: 0.468, threePointPct: 0.362, freeThrowPct: 0.820 } },
    { name: 'James Donaldson', position: 'C', isAllStar: true, stats: { points: 7.0, rebounds: 8.9, assists: 0.8, steals: 0.4, blocks: 1.0, fieldGoalPct: 0.551, threePointPct: 0.000, freeThrowPct: 0.720 } },
    { name: 'Jim Jackson', position: 'SG', stats: { points: 19.2, rebounds: 4.8, assists: 4.6, steals: 1.0, blocks: 0.3, fieldGoalPct: 0.445, threePointPct: 0.363, freeThrowPct: 0.782 } },
  ],
  // Mavericks Luka Era 2020-2024
  '7-nba-7-2020': [
    { name: 'Luka Doncic', position: 'PG', isAllStar: true, stats: { points: 33.9, rebounds: 9.2, assists: 9.8, steals: 1.4, blocks: 0.5, fieldGoalPct: 0.487, threePointPct: 0.382, freeThrowPct: 0.786 } },
    { name: 'Kyrie Irving', position: 'SG', isAllStar: true, stats: { points: 27.1, rebounds: 5.1, assists: 5.5, steals: 1.1, blocks: 0.8, fieldGoalPct: 0.494, threePointPct: 0.379, freeThrowPct: 0.905 } },
    { name: 'Jalen Brunson', position: 'PG', isAllStar: true, stats: { points: 16.3, rebounds: 3.9, assists: 4.8, steals: 0.8, blocks: 0.0, fieldGoalPct: 0.502, threePointPct: 0.373, freeThrowPct: 0.840 } },
    { name: 'Tim Hardaway Jr.', position: 'SF', stats: { points: 16.6, rebounds: 3.3, assists: 1.8, steals: 0.5, blocks: 0.1, fieldGoalPct: 0.428, threePointPct: 0.391, freeThrowPct: 0.816 } },
    { name: 'P.J. Washington', position: 'PF', stats: { points: 12.9, rebounds: 5.6, assists: 1.9, steals: 0.9, blocks: 0.8, fieldGoalPct: 0.436, threePointPct: 0.314, freeThrowPct: 0.683 } },
    { name: 'Dereck Lively II', position: 'C', stats: { points: 8.8, rebounds: 6.9, assists: 1.1, steals: 0.7, blocks: 1.4, fieldGoalPct: 0.747, threePointPct: 0.000, freeThrowPct: 0.506 } },
  ],

  // Nuggets English Era 1980-1984
  '8-nba-8-1980': [
    { name: 'Alex English', position: 'SF', isLegend: true, stats: { points: 28.4, rebounds: 7.3, assists: 4.8, steals: 1.4, blocks: 1.5, fieldGoalPct: 0.516, threePointPct: 0.167, freeThrowPct: 0.829 } },
    { name: 'Kiki Vandeweghe', position: 'PF', isAllStar: true, stats: { points: 29.4, rebounds: 4.8, assists: 3.1, steals: 0.7, blocks: 0.6, fieldGoalPct: 0.558, threePointPct: 0.367, freeThrowPct: 0.852 } },
    { name: 'Dan Issel', position: 'C', isLegend: true, stats: { points: 21.6, rebounds: 7.5, assists: 2.5, steals: 0.8, blocks: 0.6, fieldGoalPct: 0.493, threePointPct: 0.167, freeThrowPct: 0.821 } },
    { name: 'T.R. Dunn', position: 'SG', stats: { points: 7.8, rebounds: 6.8, assists: 2.4, steals: 1.7, blocks: 0.4, fieldGoalPct: 0.460, threePointPct: 0.111, freeThrowPct: 0.720 } },
    { name: 'Rob Williams', position: 'PG', stats: { points: 12.9, rebounds: 2.1, assists: 6.1, steals: 1.3, blocks: 0.2, fieldGoalPct: 0.446, threePointPct: 0.192, freeThrowPct: 0.764 } },
    { name: 'Bill Hanzlik', position: 'SG', stats: { points: 7.8, rebounds: 3.2, assists: 3.4, steals: 1.2, blocks: 0.3, fieldGoalPct: 0.480, threePointPct: 0.200, freeThrowPct: 0.750 } },
  ],
  // Nuggets Mutombo Era 1990-1994
  '8-nba-8-1990': [
    { name: 'Dikembe Mutombo', position: 'C', isLegend: true, stats: { points: 16.6, rebounds: 12.3, assists: 1.8, steals: 0.6, blocks: 3.5, fieldGoalPct: 0.510, threePointPct: 0.000, freeThrowPct: 0.681 } },
    { name: 'Mahmoud Abdul-Rauf', position: 'PG', stats: { points: 19.2, rebounds: 2.1, assists: 6.8, steals: 1.1, blocks: 0.1, fieldGoalPct: 0.470, threePointPct: 0.386, freeThrowPct: 0.885 } },
    { name: 'LaPhonso Ellis', position: 'PF', stats: { points: 15.4, rebounds: 8.6, assists: 1.9, steals: 0.8, blocks: 1.0, fieldGoalPct: 0.504, threePointPct: 0.333, freeThrowPct: 0.748 } },
    { name: 'Reggie Williams', position: 'SF', stats: { points: 13.0, rebounds: 4.6, assists: 2.7, steals: 1.3, blocks: 0.6, fieldGoalPct: 0.450, threePointPct: 0.319, freeThrowPct: 0.742 } },
    { name: 'Robert Pack', position: 'SG', stats: { points: 12.1, rebounds: 2.5, assists: 4.8, steals: 1.2, blocks: 0.2, fieldGoalPct: 0.440, threePointPct: 0.287, freeThrowPct: 0.742 } },
    { name: 'Bryant Stith', position: 'SG', stats: { points: 14.9, rebounds: 3.7, assists: 2.3, steals: 1.2, blocks: 0.3, fieldGoalPct: 0.456, threePointPct: 0.332, freeThrowPct: 0.828 } },
  ],

  // Pistons Going To Work Era 2000-2004
  '9-nba-9-2000': [
    { name: 'Chauncey Billups', position: 'PG', isAllStar: true, stats: { points: 16.9, rebounds: 3.5, assists: 5.7, steals: 1.1, blocks: 0.2, fieldGoalPct: 0.394, threePointPct: 0.388, freeThrowPct: 0.878 } },
    { name: 'Richard Hamilton', position: 'SG', isAllStar: true, stats: { points: 20.1, rebounds: 3.9, assists: 3.9, steals: 0.9, blocks: 0.2, fieldGoalPct: 0.455, threePointPct: 0.265, freeThrowPct: 0.868 } },
    { name: 'Tayshaun Prince', position: 'SF', stats: { points: 14.7, rebounds: 5.3, assists: 3.0, steals: 0.7, blocks: 0.8, fieldGoalPct: 0.467, threePointPct: 0.363, freeThrowPct: 0.766 } },
    { name: 'Rasheed Wallace', position: 'PF', isAllStar: true, stats: { points: 15.1, rebounds: 7.2, assists: 1.8, steals: 1.1, blocks: 1.8, fieldGoalPct: 0.431, threePointPct: 0.319, freeThrowPct: 0.704 } },
    { name: 'Ben Wallace', position: 'C', isLegend: true, stats: { points: 9.7, rebounds: 15.4, assists: 1.6, steals: 1.4, blocks: 3.2, fieldGoalPct: 0.531, threePointPct: 0.000, freeThrowPct: 0.423 } },
    { name: 'Corliss Williamson', position: 'PF', stats: { points: 13.6, rebounds: 4.1, assists: 1.2, steals: 0.6, blocks: 0.3, fieldGoalPct: 0.510, threePointPct: 0.200, freeThrowPct: 0.707 } },
  ],
  // Pistons Late Contender Era 2005-2009
  '9-nba-9-2005': [
    { name: 'Chauncey Billups', position: 'PG', isAllStar: true, stats: { points: 18.5, rebounds: 3.1, assists: 8.6, steals: 1.0, blocks: 0.1, fieldGoalPct: 0.418, threePointPct: 0.433, freeThrowPct: 0.894 } },
    { name: 'Richard Hamilton', position: 'SG', isAllStar: true, stats: { points: 20.1, rebounds: 3.3, assists: 4.2, steals: 0.8, blocks: 0.1, fieldGoalPct: 0.491, threePointPct: 0.458, freeThrowPct: 0.845 } },
    { name: 'Tayshaun Prince', position: 'SF', stats: { points: 14.7, rebounds: 5.8, assists: 3.1, steals: 0.7, blocks: 0.6, fieldGoalPct: 0.460, threePointPct: 0.386, freeThrowPct: 0.768 } },
    { name: 'Rasheed Wallace', position: 'PF', isAllStar: true, stats: { points: 15.0, rebounds: 6.8, assists: 1.9, steals: 1.0, blocks: 1.6, fieldGoalPct: 0.423, threePointPct: 0.351, freeThrowPct: 0.788 } },
    { name: 'Antonio McDyess', position: 'C', stats: { points: 9.6, rebounds: 9.8, assists: 1.3, steals: 0.7, blocks: 0.8, fieldGoalPct: 0.510, threePointPct: 0.000, freeThrowPct: 0.698 } },
    { name: 'Lindsey Hunter', position: 'PG', stats: { points: 5.8, rebounds: 1.7, assists: 2.7, steals: 1.2, blocks: 0.1, fieldGoalPct: 0.398, threePointPct: 0.355, freeThrowPct: 0.760 } },
  ],
  // Pistons Cade Era 2020-2024
  '9-nba-9-2020': [
    { name: 'Cade Cunningham', position: 'PG', stats: { points: 22.7, rebounds: 4.3, assists: 7.5, steals: 0.9, blocks: 0.4, fieldGoalPct: 0.449, threePointPct: 0.355, freeThrowPct: 0.869 } },
    { name: 'Bojan Bogdanovic', position: 'SF', stats: { points: 21.6, rebounds: 3.8, assists: 2.6, steals: 0.6, blocks: 0.1, fieldGoalPct: 0.488, threePointPct: 0.411, freeThrowPct: 0.884 } },
    { name: 'Jerami Grant', position: 'PF', stats: { points: 22.3, rebounds: 4.6, assists: 2.8, steals: 0.6, blocks: 1.1, fieldGoalPct: 0.429, threePointPct: 0.350, freeThrowPct: 0.845 } },
    { name: 'Jaden Ivey', position: 'SG', stats: { points: 16.3, rebounds: 3.9, assists: 5.2, steals: 0.8, blocks: 0.2, fieldGoalPct: 0.416, threePointPct: 0.343, freeThrowPct: 0.747 } },
    { name: 'Jalen Duren', position: 'C', stats: { points: 13.8, rebounds: 11.6, assists: 2.4, steals: 0.5, blocks: 0.8, fieldGoalPct: 0.619, threePointPct: 0.000, freeThrowPct: 0.790 } },
    { name: 'Saddiq Bey', position: 'SF', stats: { points: 16.1, rebounds: 5.4, assists: 2.8, steals: 0.9, blocks: 0.2, fieldGoalPct: 0.396, threePointPct: 0.346, freeThrowPct: 0.827 } },
  ],

  // Warriors Run TMC Era 1985-1989
  '10-nba-10-1985': [
    { name: 'Chris Mullin', position: 'SF', isLegend: true, stats: { points: 26.5, rebounds: 5.9, assists: 5.1, steals: 2.1, blocks: 0.5, fieldGoalPct: 0.509, threePointPct: 0.230, freeThrowPct: 0.892 } },
    { name: 'Mitch Richmond', position: 'SG', isLegend: true, stats: { points: 22.0, rebounds: 5.9, assists: 4.2, steals: 1.0, blocks: 0.2, fieldGoalPct: 0.468, threePointPct: 0.367, freeThrowPct: 0.810 } },
    { name: 'Tim Hardaway', position: 'PG', isAllStar: true, stats: { points: 14.7, rebounds: 3.9, assists: 8.7, steals: 2.1, blocks: 0.2, fieldGoalPct: 0.471, threePointPct: 0.274, freeThrowPct: 0.764 } },
    { name: 'Larry Smith', position: 'PF', stats: { points: 7.7, rebounds: 11.0, assists: 1.1, steals: 0.9, blocks: 0.7, fieldGoalPct: 0.530, threePointPct: 0.000, freeThrowPct: 0.598 } },
    { name: 'Ralph Sampson', position: 'C', isAllStar: true, stats: { points: 15.4, rebounds: 10.0, assists: 2.9, steals: 0.8, blocks: 1.1, fieldGoalPct: 0.449, threePointPct: 0.375, freeThrowPct: 0.720 } },
    { name: 'Rod Higgins', position: 'PF', stats: { points: 10.3, rebounds: 4.0, assists: 1.6, steals: 0.6, blocks: 0.3, fieldGoalPct: 0.478, threePointPct: 0.364, freeThrowPct: 0.775 } },
  ],
  // Warriors Webber/Sprewell Era 1990-1994
  '10-nba-10-1990': [
    { name: 'Tim Hardaway', position: 'PG', isAllStar: true, stats: { points: 23.4, rebounds: 3.8, assists: 10.0, steals: 2.0, blocks: 0.2, fieldGoalPct: 0.461, threePointPct: 0.338, freeThrowPct: 0.766 } },
    { name: 'Chris Mullin', position: 'SF', isLegend: true, stats: { points: 25.7, rebounds: 5.4, assists: 4.0, steals: 2.1, blocks: 0.8, fieldGoalPct: 0.536, threePointPct: 0.366, freeThrowPct: 0.884 } },
    { name: 'Latrell Sprewell', position: 'SG', isAllStar: true, stats: { points: 21.0, rebounds: 4.9, assists: 4.7, steals: 2.2, blocks: 0.9, fieldGoalPct: 0.433, threePointPct: 0.361, freeThrowPct: 0.774 } },
    { name: 'Chris Webber', position: 'PF', isLegend: true, stats: { points: 17.5, rebounds: 9.1, assists: 3.6, steals: 1.2, blocks: 2.2, fieldGoalPct: 0.552, threePointPct: 0.000, freeThrowPct: 0.532 } },
    { name: 'Rony Seikaly', position: 'C', stats: { points: 12.1, rebounds: 7.4, assists: 1.0, steals: 0.5, blocks: 0.8, fieldGoalPct: 0.502, threePointPct: 0.000, freeThrowPct: 0.722 } },
    { name: 'Billy Owens', position: 'SF', stats: { points: 15.0, rebounds: 7.9, assists: 3.6, steals: 1.0, blocks: 0.7, fieldGoalPct: 0.508, threePointPct: 0.111, freeThrowPct: 0.687 } },
  ],

  // Rockets Moses Era 1980-1984
  '11-nba-11-1980': [
    { name: 'Moses Malone', position: 'C', isLegend: true, stats: { points: 31.1, rebounds: 14.7, assists: 1.8, steals: 0.9, blocks: 1.5, fieldGoalPct: 0.519, threePointPct: 0.000, freeThrowPct: 0.762 } },
    { name: 'Calvin Murphy', position: 'PG', isLegend: true, stats: { points: 16.7, rebounds: 1.4, assists: 3.3, steals: 1.5, blocks: 0.0, fieldGoalPct: 0.493, threePointPct: 0.000, freeThrowPct: 0.958 } },
    { name: 'Robert Reid', position: 'SF', stats: { points: 15.9, rebounds: 7.1, assists: 3.8, steals: 1.5, blocks: 0.7, fieldGoalPct: 0.478, threePointPct: 0.276, freeThrowPct: 0.733 } },
    { name: 'Mike Dunleavy', position: 'SG', stats: { points: 10.5, rebounds: 2.5, assists: 5.4, steals: 1.0, blocks: 0.1, fieldGoalPct: 0.441, threePointPct: 0.286, freeThrowPct: 0.804 } },
    { name: 'Rudy Tomjanovich', position: 'PF', stats: { points: 11.6, rebounds: 4.0, assists: 1.6, steals: 0.4, blocks: 0.2, fieldGoalPct: 0.468, threePointPct: 0.000, freeThrowPct: 0.720 } },
    { name: 'Billy Paultz', position: 'C', stats: { points: 9.9, rebounds: 6.2, assists: 1.7, steals: 0.5, blocks: 1.5, fieldGoalPct: 0.500, threePointPct: 0.000, freeThrowPct: 0.700 } },
  ],
  // Rockets Harden Era 2015-2019
  '11-nba-11-2015': [
    { name: 'James Harden', position: 'SG', isAllStar: true, stats: { points: 36.1, rebounds: 6.6, assists: 7.5, steals: 2.0, blocks: 0.7, fieldGoalPct: 0.442, threePointPct: 0.368, freeThrowPct: 0.879 } },
    { name: 'Chris Paul', position: 'PG', isLegend: true, stats: { points: 18.6, rebounds: 5.4, assists: 7.9, steals: 1.7, blocks: 0.2, fieldGoalPct: 0.460, threePointPct: 0.380, freeThrowPct: 0.919 } },
    { name: 'Clint Capela', position: 'C', stats: { points: 16.6, rebounds: 12.7, assists: 1.4, steals: 0.7, blocks: 1.5, fieldGoalPct: 0.648, threePointPct: 0.000, freeThrowPct: 0.636 } },
    { name: 'Trevor Ariza', position: 'SF', stats: { points: 12.7, rebounds: 4.5, assists: 2.3, steals: 2.0, blocks: 0.3, fieldGoalPct: 0.402, threePointPct: 0.371, freeThrowPct: 0.854 } },
    { name: 'Ryan Anderson', position: 'PF', stats: { points: 13.6, rebounds: 4.6, assists: 0.9, steals: 0.4, blocks: 0.2, fieldGoalPct: 0.418, threePointPct: 0.403, freeThrowPct: 0.860 } },
    { name: 'Eric Gordon', position: 'SG', stats: { points: 18.0, rebounds: 2.5, assists: 2.2, steals: 0.6, blocks: 0.5, fieldGoalPct: 0.406, threePointPct: 0.372, freeThrowPct: 0.840 } },
  ],

  // Pacers Reggie Breakthrough Era 2000-2004
  '12-nba-12-2000': [
    { name: 'Jermaine ONeal', position: 'PF', isAllStar: true, stats: { points: 24.3, rebounds: 8.8, assists: 1.9, steals: 0.6, blocks: 2.0, fieldGoalPct: 0.434, threePointPct: 0.111, freeThrowPct: 0.757 } },
    { name: 'Reggie Miller', position: 'SG', isLegend: true, stats: { points: 18.9, rebounds: 2.5, assists: 3.2, steals: 1.1, blocks: 0.2, fieldGoalPct: 0.441, threePointPct: 0.366, freeThrowPct: 0.900 } },
    { name: 'Jalen Rose', position: 'SF', stats: { points: 20.5, rebounds: 5.0, assists: 6.0, steals: 0.9, blocks: 0.6, fieldGoalPct: 0.457, threePointPct: 0.339, freeThrowPct: 0.828 } },
    { name: 'Jamaal Tinsley', position: 'PG', stats: { points: 9.4, rebounds: 3.7, assists: 8.1, steals: 1.7, blocks: 0.5, fieldGoalPct: 0.380, threePointPct: 0.240, freeThrowPct: 0.704 } },
    { name: 'Brad Miller', position: 'C', isAllStar: true, stats: { points: 13.1, rebounds: 8.3, assists: 2.6, steals: 0.9, blocks: 0.6, fieldGoalPct: 0.493, threePointPct: 0.313, freeThrowPct: 0.818 } },
    { name: 'Al Harrington', position: 'PF', stats: { points: 13.3, rebounds: 6.4, assists: 1.7, steals: 0.9, blocks: 0.3, fieldGoalPct: 0.464, threePointPct: 0.273, freeThrowPct: 0.734 } },
  ],
  // Pacers Haliburton Era 2020-2024
  '12-nba-12-2020': [
    { name: 'Tyrese Haliburton', position: 'PG', isAllStar: true, stats: { points: 20.7, rebounds: 3.7, assists: 10.4, steals: 1.6, blocks: 0.7, fieldGoalPct: 0.477, threePointPct: 0.400, freeThrowPct: 0.871 } },
    { name: 'Pascal Siakam', position: 'PF', isAllStar: true, stats: { points: 21.3, rebounds: 7.8, assists: 3.7, steals: 0.8, blocks: 0.4, fieldGoalPct: 0.549, threePointPct: 0.386, freeThrowPct: 0.699 } },
    { name: 'Myles Turner', position: 'C', stats: { points: 18.0, rebounds: 7.5, assists: 1.4, steals: 0.6, blocks: 2.3, fieldGoalPct: 0.548, threePointPct: 0.373, freeThrowPct: 0.783 } },
    { name: 'Bennedict Mathurin', position: 'SG', stats: { points: 16.7, rebounds: 4.1, assists: 1.5, steals: 0.6, blocks: 0.2, fieldGoalPct: 0.434, threePointPct: 0.323, freeThrowPct: 0.828 } },
    { name: 'Buddy Hield', position: 'SG', stats: { points: 16.8, rebounds: 5.0, assists: 2.8, steals: 1.2, blocks: 0.3, fieldGoalPct: 0.458, threePointPct: 0.425, freeThrowPct: 0.822 } },
    { name: 'Aaron Nesmith', position: 'SF', stats: { points: 12.2, rebounds: 3.8, assists: 1.5, steals: 0.9, blocks: 0.7, fieldGoalPct: 0.496, threePointPct: 0.419, freeThrowPct: 0.781 } },
  ],

  // Clippers Lob City Start 2005-2009
  '13-nba-13-2005': [
    { name: 'Elton Brand', position: 'PF', isAllStar: true, stats: { points: 24.7, rebounds: 10.0, assists: 2.6, steals: 1.0, blocks: 2.5, fieldGoalPct: 0.527, threePointPct: 0.333, freeThrowPct: 0.775 } },
    { name: 'Sam Cassell', position: 'PG', isAllStar: true, stats: { points: 17.2, rebounds: 3.7, assists: 6.3, steals: 0.9, blocks: 0.1, fieldGoalPct: 0.443, threePointPct: 0.368, freeThrowPct: 0.863 } },
    { name: 'Corey Maggette', position: 'SF', stats: { points: 22.2, rebounds: 6.0, assists: 3.4, steals: 0.9, blocks: 0.1, fieldGoalPct: 0.458, threePointPct: 0.384, freeThrowPct: 0.812 } },
    { name: 'Cuttino Mobley', position: 'SG', stats: { points: 14.8, rebounds: 4.3, assists: 3.0, steals: 1.2, blocks: 0.4, fieldGoalPct: 0.440, threePointPct: 0.339, freeThrowPct: 0.839 } },
    { name: 'Chris Kaman', position: 'C', isAllStar: true, stats: { points: 15.7, rebounds: 12.7, assists: 1.9, steals: 0.5, blocks: 1.9, fieldGoalPct: 0.490, threePointPct: 0.000, freeThrowPct: 0.749 } },
    { name: 'Shaun Livingston', position: 'PG', stats: { points: 9.3, rebounds: 3.4, assists: 5.1, steals: 1.1, blocks: 0.5, fieldGoalPct: 0.463, threePointPct: 0.000, freeThrowPct: 0.707 } },
  ],
  // Clippers Danny Manning Era 1990-1994
  '13-nba-13-1990': [
    { name: 'Danny Manning', position: 'PF', isAllStar: true, stats: { points: 22.8, rebounds: 6.6, assists: 2.6, steals: 1.4, blocks: 1.3, fieldGoalPct: 0.509, threePointPct: 0.267, freeThrowPct: 0.802 } },
    { name: 'Ron Harper', position: 'SG', stats: { points: 20.1, rebounds: 5.5, assists: 5.1, steals: 2.1, blocks: 0.9, fieldGoalPct: 0.448, threePointPct: 0.280, freeThrowPct: 0.736 } },
    { name: 'Mark Jackson', position: 'PG', isAllStar: true, stats: { points: 13.8, rebounds: 4.7, assists: 8.8, steals: 1.7, blocks: 0.1, fieldGoalPct: 0.459, threePointPct: 0.290, freeThrowPct: 0.789 } },
    { name: 'Loy Vaught', position: 'C', stats: { points: 17.5, rebounds: 9.7, assists: 1.4, steals: 0.8, blocks: 0.7, fieldGoalPct: 0.511, threePointPct: 0.000, freeThrowPct: 0.707 } },
    { name: 'Ken Norman', position: 'SF', stats: { points: 15.0, rebounds: 7.2, assists: 2.0, steals: 1.0, blocks: 0.4, fieldGoalPct: 0.475, threePointPct: 0.300, freeThrowPct: 0.735 } },
    { name: 'Gary Grant', position: 'PG', stats: { points: 13.1, rebounds: 3.1, assists: 7.4, steals: 2.3, blocks: 0.2, fieldGoalPct: 0.438, threePointPct: 0.232, freeThrowPct: 0.744 } },
  ],

  // Grizzlies Expansion Era 1995-1999
  '15-nba-15-1995': [
    { name: 'Shareef Abdur-Rahim', position: 'PF', isAllStar: true, stats: { points: 22.3, rebounds: 7.1, assists: 2.6, steals: 1.1, blocks: 0.9, fieldGoalPct: 0.485, threePointPct: 0.412, freeThrowPct: 0.784 } },
    { name: 'Mike Bibby', position: 'PG', stats: { points: 14.5, rebounds: 3.7, assists: 8.1, steals: 1.6, blocks: 0.2, fieldGoalPct: 0.430, threePointPct: 0.203, freeThrowPct: 0.751 } },
    { name: 'Bryant Reeves', position: 'C', stats: { points: 16.3, rebounds: 7.9, assists: 1.6, steals: 0.5, blocks: 0.7, fieldGoalPct: 0.486, threePointPct: 0.074, freeThrowPct: 0.704 } },
    { name: 'Michael Dickerson', position: 'SG', stats: { points: 18.2, rebounds: 3.4, assists: 2.5, steals: 1.4, blocks: 0.3, fieldGoalPct: 0.431, threePointPct: 0.409, freeThrowPct: 0.841 } },
    { name: 'Blue Edwards', position: 'SF', stats: { points: 12.7, rebounds: 3.9, assists: 2.4, steals: 1.0, blocks: 0.4, fieldGoalPct: 0.455, threePointPct: 0.354, freeThrowPct: 0.762 } },
    { name: 'Greg Anthony', position: 'PG', stats: { points: 14.0, rebounds: 2.5, assists: 6.9, steals: 1.7, blocks: 0.1, fieldGoalPct: 0.415, threePointPct: 0.362, freeThrowPct: 0.772 } },
  ],
  // Grizzlies Gasol Era 2005-2009
  '15-nba-15-2005': [
    { name: 'Pau Gasol', position: 'PF', isLegend: true, stats: { points: 20.8, rebounds: 9.8, assists: 3.4, steals: 0.6, blocks: 2.1, fieldGoalPct: 0.503, threePointPct: 0.250, freeThrowPct: 0.689 } },
    { name: 'Mike Miller', position: 'SG', stats: { points: 18.5, rebounds: 5.4, assists: 4.3, steals: 0.8, blocks: 0.3, fieldGoalPct: 0.460, threePointPct: 0.406, freeThrowPct: 0.793 } },
    { name: 'Shane Battier', position: 'SF', stats: { points: 10.1, rebounds: 5.3, assists: 1.7, steals: 1.3, blocks: 1.0, fieldGoalPct: 0.488, threePointPct: 0.395, freeThrowPct: 0.707 } },
    { name: 'Jason Williams', position: 'PG', stats: { points: 10.9, rebounds: 2.4, assists: 6.8, steals: 1.3, blocks: 0.1, fieldGoalPct: 0.413, threePointPct: 0.324, freeThrowPct: 0.792 } },
    { name: 'Stromile Swift', position: 'C', stats: { points: 10.1, rebounds: 4.6, assists: 0.6, steals: 0.7, blocks: 1.5, fieldGoalPct: 0.449, threePointPct: 0.000, freeThrowPct: 0.758 } },
    { name: 'James Posey', position: 'SF', stats: { points: 8.1, rebounds: 4.8, assists: 1.7, steals: 1.3, blocks: 0.4, fieldGoalPct: 0.439, threePointPct: 0.386, freeThrowPct: 0.822 } },
  ],

  // Heat Zo/Hardaway Era 1995-1999
  '16-nba-16-1995': [
    { name: 'Alonzo Mourning', position: 'C', isLegend: true, stats: { points: 22.7, rebounds: 10.4, assists: 1.6, steals: 0.7, blocks: 3.9, fieldGoalPct: 0.511, threePointPct: 0.000, freeThrowPct: 0.652 } },
    { name: 'Tim Hardaway', position: 'PG', isAllStar: true, stats: { points: 20.3, rebounds: 3.4, assists: 8.6, steals: 1.9, blocks: 0.1, fieldGoalPct: 0.415, threePointPct: 0.344, freeThrowPct: 0.799 } },
    { name: 'Jamal Mashburn', position: 'SF', isAllStar: true, stats: { points: 15.1, rebounds: 4.8, assists: 3.1, steals: 1.0, blocks: 0.2, fieldGoalPct: 0.413, threePointPct: 0.356, freeThrowPct: 0.783 } },
    { name: 'Voshon Lenard', position: 'SG', stats: { points: 12.3, rebounds: 2.7, assists: 2.4, steals: 0.8, blocks: 0.2, fieldGoalPct: 0.441, threePointPct: 0.386, freeThrowPct: 0.825 } },
    { name: 'P.J. Brown', position: 'PF', stats: { points: 9.6, rebounds: 8.1, assists: 1.5, steals: 0.9, blocks: 1.2, fieldGoalPct: 0.480, threePointPct: 0.200, freeThrowPct: 0.735 } },
    { name: 'Dan Majerle', position: 'SG', stats: { points: 8.6, rebounds: 4.5, assists: 2.4, steals: 1.2, blocks: 0.4, fieldGoalPct: 0.425, threePointPct: 0.377, freeThrowPct: 0.748 } },
  ],
  // Heat Butler/Bam Era 2020-2024
  '16-nba-16-2020': [
    { name: 'Jimmy Butler', position: 'SF', isAllStar: true, stats: { points: 22.9, rebounds: 5.9, assists: 5.3, steals: 1.8, blocks: 0.3, fieldGoalPct: 0.539, threePointPct: 0.350, freeThrowPct: 0.850 } },
    { name: 'Bam Adebayo', position: 'C', isAllStar: true, stats: { points: 20.4, rebounds: 10.4, assists: 3.9, steals: 1.1, blocks: 0.9, fieldGoalPct: 0.540, threePointPct: 0.083, freeThrowPct: 0.806 } },
    { name: 'Tyler Herro', position: 'SG', stats: { points: 20.7, rebounds: 5.0, assists: 4.0, steals: 0.7, blocks: 0.2, fieldGoalPct: 0.439, threePointPct: 0.399, freeThrowPct: 0.934 } },
    { name: 'Kyle Lowry', position: 'PG', isLegend: true, stats: { points: 13.4, rebounds: 4.5, assists: 7.5, steals: 1.1, blocks: 0.3, fieldGoalPct: 0.440, threePointPct: 0.377, freeThrowPct: 0.851 } },
    { name: 'Caleb Martin', position: 'PF', stats: { points: 10.0, rebounds: 4.4, assists: 1.9, steals: 1.0, blocks: 0.5, fieldGoalPct: 0.464, threePointPct: 0.356, freeThrowPct: 0.805 } },
    { name: 'Duncan Robinson', position: 'SF', stats: { points: 13.5, rebounds: 2.7, assists: 1.8, steals: 0.6, blocks: 0.3, fieldGoalPct: 0.450, threePointPct: 0.408, freeThrowPct: 0.827 } },
  ],

  // Bucks Kareem/Oscar Era 1970-1974
  '17-nba-17-1970': [
    { name: 'Kareem Abdul-Jabbar', position: 'C', isLegend: true, stats: { points: 34.8, rebounds: 16.6, assists: 4.6, steals: 1.4, blocks: 3.5, fieldGoalPct: 0.574, threePointPct: 0.000, freeThrowPct: 0.689 } },
    { name: 'Oscar Robertson', position: 'PG', isLegend: true, stats: { points: 19.4, rebounds: 5.7, assists: 8.2, steals: 1.1, blocks: 0.1, fieldGoalPct: 0.496, threePointPct: 0.000, freeThrowPct: 0.850 } },
    { name: 'Bob Dandridge', position: 'SF', isAllStar: true, stats: { points: 18.4, rebounds: 7.3, assists: 3.2, steals: 1.3, blocks: 0.6, fieldGoalPct: 0.509, threePointPct: 0.000, freeThrowPct: 0.783 } },
    { name: 'Lucius Allen', position: 'SG', stats: { points: 17.6, rebounds: 3.6, assists: 5.2, steals: 1.6, blocks: 0.3, fieldGoalPct: 0.505, threePointPct: 0.000, freeThrowPct: 0.760 } },
    { name: 'Curtis Perry', position: 'PF', stats: { points: 9.8, rebounds: 8.6, assists: 2.3, steals: 1.0, blocks: 0.5, fieldGoalPct: 0.470, threePointPct: 0.000, freeThrowPct: 0.700 } },
    { name: 'Jon McGlocklin', position: 'SG', stats: { points: 15.8, rebounds: 2.4, assists: 3.2, steals: 0.6, blocks: 0.1, fieldGoalPct: 0.508, threePointPct: 0.000, freeThrowPct: 0.861 } },
  ],
  // Bucks Ray Allen Era 2000-2004
  '17-nba-17-2000': [
    { name: 'Ray Allen', position: 'SG', isLegend: true, stats: { points: 22.1, rebounds: 5.2, assists: 4.6, steals: 1.5, blocks: 0.2, fieldGoalPct: 0.480, threePointPct: 0.433, freeThrowPct: 0.888 } },
    { name: 'Glenn Robinson', position: 'SF', isAllStar: true, stats: { points: 22.0, rebounds: 6.9, assists: 3.3, steals: 1.1, blocks: 0.6, fieldGoalPct: 0.468, threePointPct: 0.326, freeThrowPct: 0.820 } },
    { name: 'Sam Cassell', position: 'PG', isAllStar: true, stats: { points: 19.7, rebounds: 3.7, assists: 7.6, steals: 1.2, blocks: 0.2, fieldGoalPct: 0.474, threePointPct: 0.348, freeThrowPct: 0.858 } },
    { name: 'Tim Thomas', position: 'PF', stats: { points: 13.4, rebounds: 4.1, assists: 1.8, steals: 0.9, blocks: 0.6, fieldGoalPct: 0.430, threePointPct: 0.412, freeThrowPct: 0.771 } },
    { name: 'Ervin Johnson', position: 'C', stats: { points: 3.2, rebounds: 7.5, assists: 0.5, steals: 0.5, blocks: 1.2, fieldGoalPct: 0.488, threePointPct: 0.000, freeThrowPct: 0.625 } },
    { name: 'Michael Redd', position: 'SG', stats: { points: 15.1, rebounds: 4.5, assists: 1.4, steals: 1.2, blocks: 0.2, fieldGoalPct: 0.483, threePointPct: 0.444, freeThrowPct: 0.791 } },
  ],

  // Timberwolves Garnett MVP Era 1995-1999
  '18-nba-18-1995': [
    { name: 'Kevin Garnett', position: 'PF', isLegend: true, stats: { points: 20.8, rebounds: 10.4, assists: 4.3, steals: 1.7, blocks: 1.8, fieldGoalPct: 0.491, threePointPct: 0.286, freeThrowPct: 0.738 } },
    { name: 'Stephon Marbury', position: 'PG', isAllStar: true, stats: { points: 17.7, rebounds: 2.9, assists: 8.6, steals: 1.3, blocks: 0.1, fieldGoalPct: 0.408, threePointPct: 0.313, freeThrowPct: 0.724 } },
    { name: 'Tom Gugliotta', position: 'SF', isAllStar: true, stats: { points: 20.6, rebounds: 8.7, assists: 4.1, steals: 1.6, blocks: 1.1, fieldGoalPct: 0.442, threePointPct: 0.258, freeThrowPct: 0.820 } },
    { name: 'Isaiah Rider', position: 'SG', stats: { points: 19.6, rebounds: 3.3, assists: 3.4, steals: 0.9, blocks: 0.3, fieldGoalPct: 0.447, threePointPct: 0.360, freeThrowPct: 0.813 } },
    { name: 'Dean Garrett', position: 'C', stats: { points: 8.0, rebounds: 7.3, assists: 0.7, steals: 0.5, blocks: 1.5, fieldGoalPct: 0.533, threePointPct: 0.000, freeThrowPct: 0.678 } },
    { name: 'Doug West', position: 'SG', stats: { points: 9.6, rebounds: 2.8, assists: 2.4, steals: 0.8, blocks: 0.2, fieldGoalPct: 0.464, threePointPct: 0.286, freeThrowPct: 0.790 } },
  ],
  // Timberwolves Love/Rubio Era 2010-2014
  '18-nba-18-2010': [
    { name: 'Kevin Love', position: 'PF', isAllStar: true, stats: { points: 26.1, rebounds: 12.5, assists: 4.4, steals: 0.8, blocks: 0.5, fieldGoalPct: 0.457, threePointPct: 0.376, freeThrowPct: 0.821 } },
    { name: 'Ricky Rubio', position: 'PG', stats: { points: 10.6, rebounds: 4.2, assists: 8.6, steals: 2.3, blocks: 0.1, fieldGoalPct: 0.381, threePointPct: 0.340, freeThrowPct: 0.802 } },
    { name: 'Nikola Pekovic', position: 'C', stats: { points: 17.5, rebounds: 8.7, assists: 0.9, steals: 0.6, blocks: 0.4, fieldGoalPct: 0.541, threePointPct: 0.000, freeThrowPct: 0.747 } },
    { name: 'Kevin Martin', position: 'SG', stats: { points: 19.1, rebounds: 3.0, assists: 1.8, steals: 1.0, blocks: 0.1, fieldGoalPct: 0.430, threePointPct: 0.387, freeThrowPct: 0.891 } },
    { name: 'Andrei Kirilenko', position: 'SF', isAllStar: true, stats: { points: 12.4, rebounds: 5.7, assists: 2.8, steals: 1.5, blocks: 1.0, fieldGoalPct: 0.507, threePointPct: 0.292, freeThrowPct: 0.752 } },
    { name: 'Corey Brewer', position: 'SF', stats: { points: 12.3, rebounds: 2.6, assists: 1.7, steals: 1.9, blocks: 0.4, fieldGoalPct: 0.481, threePointPct: 0.280, freeThrowPct: 0.718 } },
  ],

  // Pelicans Chris Paul Era 2010-2014
  '19-nba-19-2010': [
    { name: 'Chris Paul', position: 'PG', isLegend: true, stats: { points: 18.7, rebounds: 4.4, assists: 9.8, steals: 2.4, blocks: 0.1, fieldGoalPct: 0.463, threePointPct: 0.388, freeThrowPct: 0.878 } },
    { name: 'David West', position: 'PF', isAllStar: true, stats: { points: 18.9, rebounds: 7.6, assists: 2.3, steals: 0.8, blocks: 0.9, fieldGoalPct: 0.508, threePointPct: 0.222, freeThrowPct: 0.807 } },
    { name: 'Emeka Okafor', position: 'C', stats: { points: 10.3, rebounds: 9.5, assists: 0.6, steals: 0.6, blocks: 1.8, fieldGoalPct: 0.573, threePointPct: 0.000, freeThrowPct: 0.562 } },
    { name: 'Trevor Ariza', position: 'SF', stats: { points: 11.0, rebounds: 5.4, assists: 2.2, steals: 1.6, blocks: 0.4, fieldGoalPct: 0.398, threePointPct: 0.303, freeThrowPct: 0.701 } },
    { name: 'Marcus Thornton', position: 'SG', stats: { points: 16.8, rebounds: 3.9, assists: 1.7, steals: 0.8, blocks: 0.2, fieldGoalPct: 0.451, threePointPct: 0.374, freeThrowPct: 0.814 } },
    { name: 'Jarrett Jack', position: 'PG', stats: { points: 15.6, rebounds: 3.9, assists: 6.3, steals: 0.7, blocks: 0.2, fieldGoalPct: 0.456, threePointPct: 0.348, freeThrowPct: 0.872 } },
  ],
  // Pelicans Davis/Cousins Era 2015-2019
  '19-nba-19-2015': [
    { name: 'Anthony Davis', position: 'PF', isAllStar: true, stats: { points: 28.1, rebounds: 11.1, assists: 2.3, steals: 1.5, blocks: 2.6, fieldGoalPct: 0.505, threePointPct: 0.299, freeThrowPct: 0.802 } },
    { name: 'DeMarcus Cousins', position: 'C', isAllStar: true, stats: { points: 25.2, rebounds: 12.9, assists: 5.4, steals: 1.6, blocks: 1.6, fieldGoalPct: 0.470, threePointPct: 0.354, freeThrowPct: 0.746 } },
    { name: 'Jrue Holiday', position: 'PG', isAllStar: true, stats: { points: 21.2, rebounds: 5.0, assists: 7.7, steals: 1.6, blocks: 0.8, fieldGoalPct: 0.494, threePointPct: 0.337, freeThrowPct: 0.786 } },
    { name: 'Tyreke Evans', position: 'SG', stats: { points: 16.6, rebounds: 5.3, assists: 6.6, steals: 1.3, blocks: 0.5, fieldGoalPct: 0.447, threePointPct: 0.304, freeThrowPct: 0.694 } },
    { name: 'Ryan Anderson', position: 'PF', stats: { points: 17.0, rebounds: 6.0, assists: 1.1, steals: 0.6, blocks: 0.4, fieldGoalPct: 0.427, threePointPct: 0.366, freeThrowPct: 0.873 } },
    { name: 'Quincy Pondexter', position: 'SF', stats: { points: 9.0, rebounds: 3.1, assists: 1.5, steals: 0.4, blocks: 0.3, fieldGoalPct: 0.449, threePointPct: 0.433, freeThrowPct: 0.754 } },
  ],

  // Knicks Reed/Frazier Era 1970-1974
  '20-nba-20-1970': [
    { name: 'Walt Frazier', position: 'PG', isLegend: true, stats: { points: 23.2, rebounds: 6.7, assists: 6.1, steals: 2.0, blocks: 0.2, fieldGoalPct: 0.512, threePointPct: 0.000, freeThrowPct: 0.808 } },
    { name: 'Willis Reed', position: 'C', isLegend: true, stats: { points: 20.9, rebounds: 13.7, assists: 2.0, steals: 0.7, blocks: 1.1, fieldGoalPct: 0.490, threePointPct: 0.000, freeThrowPct: 0.752 } },
    { name: 'Dave DeBusschere', position: 'PF', isLegend: true, stats: { points: 16.3, rebounds: 10.5, assists: 3.4, steals: 0.9, blocks: 0.5, fieldGoalPct: 0.432, threePointPct: 0.000, freeThrowPct: 0.720 } },
    { name: 'Bill Bradley', position: 'SF', isLegend: true, stats: { points: 16.1, rebounds: 3.4, assists: 4.5, steals: 0.8, blocks: 0.2, fieldGoalPct: 0.449, threePointPct: 0.000, freeThrowPct: 0.839 } },
    { name: 'Earl Monroe', position: 'SG', isLegend: true, stats: { points: 15.5, rebounds: 2.6, assists: 3.8, steals: 1.1, blocks: 0.3, fieldGoalPct: 0.488, threePointPct: 0.000, freeThrowPct: 0.804 } },
    { name: 'Phil Jackson', position: 'PF', stats: { points: 7.0, rebounds: 4.6, assists: 1.4, steals: 0.5, blocks: 0.4, fieldGoalPct: 0.440, threePointPct: 0.000, freeThrowPct: 0.730 } },
  ],
  // Knicks Ewing Start Era 1985-1989
  '20-nba-20-1985': [
    { name: 'Patrick Ewing', position: 'C', isLegend: true, stats: { points: 22.7, rebounds: 9.3, assists: 2.4, steals: 1.5, blocks: 3.5, fieldGoalPct: 0.567, threePointPct: 0.000, freeThrowPct: 0.746 } },
    { name: 'Mark Jackson', position: 'PG', isAllStar: true, stats: { points: 13.6, rebounds: 4.8, assists: 10.6, steals: 2.5, blocks: 0.1, fieldGoalPct: 0.432, threePointPct: 0.254, freeThrowPct: 0.774 } },
    { name: 'Gerald Wilkins', position: 'SG', stats: { points: 19.1, rebounds: 3.4, assists: 4.4, steals: 1.3, blocks: 0.3, fieldGoalPct: 0.465, threePointPct: 0.304, freeThrowPct: 0.782 } },
    { name: 'Charles Oakley', position: 'PF', isAllStar: true, stats: { points: 12.9, rebounds: 10.5, assists: 2.3, steals: 1.3, blocks: 0.3, fieldGoalPct: 0.524, threePointPct: 0.000, freeThrowPct: 0.761 } },
    { name: 'Johnny Newman', position: 'SF', stats: { points: 16.0, rebounds: 3.5, assists: 1.8, steals: 1.2, blocks: 0.4, fieldGoalPct: 0.481, threePointPct: 0.338, freeThrowPct: 0.833 } },
    { name: 'Kenny Walker', position: 'SF', stats: { points: 12.0, rebounds: 4.8, assists: 1.2, steals: 0.7, blocks: 0.6, fieldGoalPct: 0.487, threePointPct: 0.000, freeThrowPct: 0.749 } },
  ],

  // Thunder/Sonics Sikma Era 1975-1979
  '21-nba-21-1975': [
    { name: 'Jack Sikma', position: 'C', isLegend: true, stats: { points: 15.6, rebounds: 12.4, assists: 3.2, steals: 1.0, blocks: 0.8, fieldGoalPct: 0.460, threePointPct: 0.000, freeThrowPct: 0.814 } },
    { name: 'Dennis Johnson', position: 'SG', isLegend: true, stats: { points: 19.0, rebounds: 5.1, assists: 4.1, steals: 1.8, blocks: 1.0, fieldGoalPct: 0.434, threePointPct: 0.000, freeThrowPct: 0.760 } },
    { name: 'Gus Williams', position: 'PG', isAllStar: true, stats: { points: 19.2, rebounds: 3.2, assists: 4.0, steals: 2.0, blocks: 0.4, fieldGoalPct: 0.495, threePointPct: 0.000, freeThrowPct: 0.775 } },
    { name: 'John Johnson', position: 'SF', stats: { points: 11.5, rebounds: 5.6, assists: 4.4, steals: 1.0, blocks: 0.4, fieldGoalPct: 0.452, threePointPct: 0.000, freeThrowPct: 0.760 } },
    { name: 'Lonnie Shelton', position: 'PF', isAllStar: true, stats: { points: 13.5, rebounds: 6.2, assists: 2.4, steals: 1.1, blocks: 0.6, fieldGoalPct: 0.521, threePointPct: 0.000, freeThrowPct: 0.729 } },
    { name: 'Fred Brown', position: 'SG', stats: { points: 14.7, rebounds: 2.2, assists: 3.3, steals: 1.3, blocks: 0.2, fieldGoalPct: 0.473, threePointPct: 0.443, freeThrowPct: 0.833 } },
  ],
  // Thunder Durant/Westbrook Era 2005-2009
  '21-nba-21-2005': [
    { name: 'Kevin Durant', position: 'SF', isAllStar: true, stats: { points: 30.1, rebounds: 7.6, assists: 2.8, steals: 1.4, blocks: 1.0, fieldGoalPct: 0.476, threePointPct: 0.365, freeThrowPct: 0.900 } },
    { name: 'Russell Westbrook', position: 'PG', isAllStar: true, stats: { points: 16.1, rebounds: 4.9, assists: 8.0, steals: 1.3, blocks: 0.4, fieldGoalPct: 0.418, threePointPct: 0.221, freeThrowPct: 0.780 } },
    { name: 'James Harden', position: 'SG', isAllStar: true, stats: { points: 9.9, rebounds: 3.2, assists: 1.8, steals: 1.1, blocks: 0.3, fieldGoalPct: 0.403, threePointPct: 0.375, freeThrowPct: 0.808 } },
    { name: 'Jeff Green', position: 'PF', stats: { points: 16.5, rebounds: 6.7, assists: 2.0, steals: 1.0, blocks: 0.4, fieldGoalPct: 0.446, threePointPct: 0.389, freeThrowPct: 0.788 } },
    { name: 'Serge Ibaka', position: 'C', stats: { points: 6.3, rebounds: 5.4, assists: 0.1, steals: 0.3, blocks: 1.3, fieldGoalPct: 0.543, threePointPct: 0.500, freeThrowPct: 0.630 } },
    { name: 'Nick Collison', position: 'PF', stats: { points: 5.9, rebounds: 5.1, assists: 0.7, steals: 0.5, blocks: 0.5, fieldGoalPct: 0.589, threePointPct: 0.000, freeThrowPct: 0.692 } },
  ],

  // Magic Heart and Hustle Era 2000-2004
  '22-nba-22-2000': [
    { name: 'Tracy McGrady', position: 'SG', isAllStar: true, stats: { points: 32.1, rebounds: 6.5, assists: 5.5, steals: 1.7, blocks: 0.8, fieldGoalPct: 0.457, threePointPct: 0.386, freeThrowPct: 0.793 } },
    { name: 'Grant Hill', position: 'SF', isLegend: true, stats: { points: 19.7, rebounds: 6.6, assists: 5.2, steals: 1.4, blocks: 0.6, fieldGoalPct: 0.492, threePointPct: 0.250, freeThrowPct: 0.792 } },
    { name: 'Darrell Armstrong', position: 'PG', stats: { points: 16.2, rebounds: 3.3, assists: 6.1, steals: 2.0, blocks: 0.1, fieldGoalPct: 0.433, threePointPct: 0.385, freeThrowPct: 0.911 } },
    { name: 'Mike Miller', position: 'SF', stats: { points: 15.2, rebounds: 4.3, assists: 3.1, steals: 0.8, blocks: 0.3, fieldGoalPct: 0.438, threePointPct: 0.407, freeThrowPct: 0.817 } },
    { name: 'Pat Garrity', position: 'PF', stats: { points: 11.1, rebounds: 4.2, assists: 0.8, steals: 0.4, blocks: 0.2, fieldGoalPct: 0.433, threePointPct: 0.427, freeThrowPct: 0.854 } },
    { name: 'Andrew DeClercq', position: 'C', stats: { points: 4.7, rebounds: 4.4, assists: 0.5, steals: 0.5, blocks: 0.4, fieldGoalPct: 0.532, threePointPct: 0.000, freeThrowPct: 0.703 } },
  ],
  // Magic Dwight Finals Era 2010-2014
  '22-nba-22-2010': [
    { name: 'Dwight Howard', position: 'C', isAllStar: true, stats: { points: 22.9, rebounds: 14.1, assists: 1.4, steals: 1.4, blocks: 2.4, fieldGoalPct: 0.593, threePointPct: 0.000, freeThrowPct: 0.596 } },
    { name: 'Jameer Nelson', position: 'PG', isAllStar: true, stats: { points: 13.1, rebounds: 3.0, assists: 7.0, steals: 1.0, blocks: 0.1, fieldGoalPct: 0.446, threePointPct: 0.401, freeThrowPct: 0.802 } },
    { name: 'Jason Richardson', position: 'SG', stats: { points: 13.9, rebounds: 4.0, assists: 2.0, steals: 1.2, blocks: 0.2, fieldGoalPct: 0.433, threePointPct: 0.384, freeThrowPct: 0.701 } },
    { name: 'Hedo Turkoglu', position: 'SF', stats: { points: 11.4, rebounds: 4.6, assists: 5.1, steals: 0.8, blocks: 0.4, fieldGoalPct: 0.448, threePointPct: 0.405, freeThrowPct: 0.667 } },
    { name: 'Ryan Anderson', position: 'PF', stats: { points: 16.1, rebounds: 7.7, assists: 0.9, steals: 0.8, blocks: 0.4, fieldGoalPct: 0.439, threePointPct: 0.393, freeThrowPct: 0.877 } },
    { name: 'Brandon Bass', position: 'PF', stats: { points: 11.2, rebounds: 5.6, assists: 0.8, steals: 0.4, blocks: 0.7, fieldGoalPct: 0.515, threePointPct: 0.000, freeThrowPct: 0.815 } },
  ],

  // 76ers Barkley Era 1990-1994
  '23-nba-23-1990': [
    { name: 'Charles Barkley', position: 'PF', isLegend: true, stats: { points: 27.6, rebounds: 10.1, assists: 4.2, steals: 1.6, blocks: 0.5, fieldGoalPct: 0.570, threePointPct: 0.284, freeThrowPct: 0.722 } },
    { name: 'Hersey Hawkins', position: 'SG', isAllStar: true, stats: { points: 22.1, rebounds: 3.9, assists: 3.7, steals: 2.2, blocks: 0.5, fieldGoalPct: 0.472, threePointPct: 0.400, freeThrowPct: 0.871 } },
    { name: 'Johnny Dawkins', position: 'PG', stats: { points: 14.7, rebounds: 2.7, assists: 7.4, steals: 1.5, blocks: 0.1, fieldGoalPct: 0.461, threePointPct: 0.318, freeThrowPct: 0.840 } },
    { name: 'Rick Mahorn', position: 'C', stats: { points: 10.8, rebounds: 7.6, assists: 1.6, steals: 0.6, blocks: 0.5, fieldGoalPct: 0.493, threePointPct: 0.000, freeThrowPct: 0.724 } },
    { name: 'Armen Gilliam', position: 'SF', stats: { points: 15.0, rebounds: 6.7, assists: 1.2, steals: 0.6, blocks: 0.5, fieldGoalPct: 0.470, threePointPct: 0.000, freeThrowPct: 0.756 } },
    { name: 'Ron Anderson', position: 'SF', stats: { points: 14.6, rebounds: 4.7, assists: 2.1, steals: 0.9, blocks: 0.2, fieldGoalPct: 0.468, threePointPct: 0.333, freeThrowPct: 0.768 } },
  ],
  // 76ers Process Era 2015-2019
  '23-nba-23-2015': [
    { name: 'Joel Embiid', position: 'C', isAllStar: true, stats: { points: 27.5, rebounds: 13.6, assists: 3.7, steals: 0.7, blocks: 1.9, fieldGoalPct: 0.484, threePointPct: 0.300, freeThrowPct: 0.804 } },
    { name: 'Ben Simmons', position: 'PG', isAllStar: true, stats: { points: 16.9, rebounds: 8.8, assists: 7.7, steals: 1.4, blocks: 0.8, fieldGoalPct: 0.563, threePointPct: 0.000, freeThrowPct: 0.600 } },
    { name: 'Jimmy Butler', position: 'SF', isAllStar: true, stats: { points: 18.2, rebounds: 5.3, assists: 4.0, steals: 1.8, blocks: 0.5, fieldGoalPct: 0.461, threePointPct: 0.338, freeThrowPct: 0.868 } },
    { name: 'JJ Redick', position: 'SG', stats: { points: 18.1, rebounds: 2.4, assists: 2.7, steals: 0.4, blocks: 0.2, fieldGoalPct: 0.440, threePointPct: 0.397, freeThrowPct: 0.894 } },
    { name: 'Tobias Harris', position: 'PF', stats: { points: 18.2, rebounds: 7.9, assists: 2.9, steals: 0.6, blocks: 0.5, fieldGoalPct: 0.469, threePointPct: 0.326, freeThrowPct: 0.841 } },
    { name: 'Robert Covington', position: 'SF', stats: { points: 12.6, rebounds: 5.4, assists: 2.0, steals: 1.7, blocks: 0.9, fieldGoalPct: 0.413, threePointPct: 0.369, freeThrowPct: 0.853 } },
  ],

  // Suns Westphal Era 1975-1979
  '24-nba-24-1975': [
    { name: 'Paul Westphal', position: 'SG', isLegend: true, stats: { points: 25.2, rebounds: 2.1, assists: 5.5, steals: 1.7, blocks: 0.4, fieldGoalPct: 0.516, threePointPct: 0.000, freeThrowPct: 0.813 } },
    { name: 'Walter Davis', position: 'SF', isAllStar: true, stats: { points: 24.2, rebounds: 6.0, assists: 3.4, steals: 1.4, blocks: 0.2, fieldGoalPct: 0.526, threePointPct: 0.000, freeThrowPct: 0.830 } },
    { name: 'Alvan Adams', position: 'C', isAllStar: true, stats: { points: 19.0, rebounds: 9.1, assists: 5.6, steals: 1.5, blocks: 1.5, fieldGoalPct: 0.469, threePointPct: 0.000, freeThrowPct: 0.735 } },
    { name: 'Gar Heard', position: 'PF', stats: { points: 11.9, rebounds: 9.9, assists: 1.7, steals: 1.2, blocks: 1.5, fieldGoalPct: 0.440, threePointPct: 0.000, freeThrowPct: 0.730 } },
    { name: 'Ricky Sobers', position: 'PG', stats: { points: 13.0, rebounds: 3.3, assists: 5.6, steals: 1.8, blocks: 0.4, fieldGoalPct: 0.435, threePointPct: 0.000, freeThrowPct: 0.800 } },
    { name: 'Curtis Perry', position: 'PF', stats: { points: 9.8, rebounds: 8.5, assists: 2.2, steals: 1.1, blocks: 0.5, fieldGoalPct: 0.478, threePointPct: 0.000, freeThrowPct: 0.724 } },
  ],
  // Suns Booker Era 2020-2024
  '24-nba-24-2020': [
    { name: 'Devin Booker', position: 'SG', isAllStar: true, stats: { points: 27.8, rebounds: 4.5, assists: 5.5, steals: 1.0, blocks: 0.3, fieldGoalPct: 0.494, threePointPct: 0.351, freeThrowPct: 0.855 } },
    { name: 'Kevin Durant', position: 'SF', isLegend: true, stats: { points: 29.1, rebounds: 6.7, assists: 5.0, steals: 0.7, blocks: 1.2, fieldGoalPct: 0.560, threePointPct: 0.404, freeThrowPct: 0.919 } },
    { name: 'Chris Paul', position: 'PG', isLegend: true, stats: { points: 16.4, rebounds: 4.5, assists: 8.9, steals: 1.4, blocks: 0.3, fieldGoalPct: 0.499, threePointPct: 0.395, freeThrowPct: 0.837 } },
    { name: 'Deandre Ayton', position: 'C', stats: { points: 18.0, rebounds: 10.0, assists: 1.7, steals: 0.6, blocks: 0.8, fieldGoalPct: 0.634, threePointPct: 0.368, freeThrowPct: 0.746 } },
    { name: 'Mikal Bridges', position: 'SF', stats: { points: 17.2, rebounds: 4.3, assists: 3.6, steals: 1.2, blocks: 0.8, fieldGoalPct: 0.468, threePointPct: 0.382, freeThrowPct: 0.895 } },
    { name: 'Jae Crowder', position: 'PF', stats: { points: 10.1, rebounds: 4.7, assists: 2.1, steals: 0.9, blocks: 0.4, fieldGoalPct: 0.404, threePointPct: 0.389, freeThrowPct: 0.760 } },
  ],

  // Trail Blazers Jail Blazers Era 2000-2004
  '25-nba-25-2000': [
    { name: 'Rasheed Wallace', position: 'PF', isAllStar: true, stats: { points: 19.3, rebounds: 8.2, assists: 1.9, steals: 1.3, blocks: 1.3, fieldGoalPct: 0.501, threePointPct: 0.321, freeThrowPct: 0.766 } },
    { name: 'Scottie Pippen', position: 'SF', isLegend: true, stats: { points: 12.5, rebounds: 5.2, assists: 5.9, steals: 1.6, blocks: 0.6, fieldGoalPct: 0.451, threePointPct: 0.344, freeThrowPct: 0.739 } },
    { name: 'Damon Stoudamire', position: 'PG', stats: { points: 13.0, rebounds: 3.7, assists: 6.2, steals: 1.0, blocks: 0.1, fieldGoalPct: 0.409, threePointPct: 0.373, freeThrowPct: 0.830 } },
    { name: 'Bonzi Wells', position: 'SG', stats: { points: 17.0, rebounds: 6.0, assists: 2.8, steals: 1.5, blocks: 0.3, fieldGoalPct: 0.441, threePointPct: 0.292, freeThrowPct: 0.743 } },
    { name: 'Arvydas Sabonis', position: 'C', isLegend: true, stats: { points: 11.8, rebounds: 7.8, assists: 1.8, steals: 0.7, blocks: 1.2, fieldGoalPct: 0.479, threePointPct: 0.067, freeThrowPct: 0.776 } },
    { name: 'Steve Smith', position: 'SG', stats: { points: 13.6, rebounds: 3.5, assists: 2.5, steals: 0.7, blocks: 0.3, fieldGoalPct: 0.456, threePointPct: 0.398, freeThrowPct: 0.890 } },
  ],
  // Trail Blazers Dame Prime Era 2020-2024
  '25-nba-25-2020': [
    { name: 'Damian Lillard', position: 'PG', isAllStar: true, stats: { points: 32.2, rebounds: 4.8, assists: 7.3, steals: 0.9, blocks: 0.3, fieldGoalPct: 0.463, threePointPct: 0.371, freeThrowPct: 0.914 } },
    { name: 'CJ McCollum', position: 'SG', stats: { points: 23.1, rebounds: 3.9, assists: 4.7, steals: 0.9, blocks: 0.4, fieldGoalPct: 0.458, threePointPct: 0.402, freeThrowPct: 0.812 } },
    { name: 'Jerami Grant', position: 'SF', stats: { points: 20.5, rebounds: 4.5, assists: 2.4, steals: 0.8, blocks: 0.8, fieldGoalPct: 0.475, threePointPct: 0.401, freeThrowPct: 0.813 } },
    { name: 'Jusuf Nurkic', position: 'C', stats: { points: 15.0, rebounds: 11.1, assists: 2.8, steals: 1.1, blocks: 0.6, fieldGoalPct: 0.535, threePointPct: 0.268, freeThrowPct: 0.690 } },
    { name: 'Robert Covington', position: 'PF', stats: { points: 8.5, rebounds: 6.7, assists: 1.7, steals: 1.4, blocks: 1.2, fieldGoalPct: 0.401, threePointPct: 0.379, freeThrowPct: 0.806 } },
    { name: 'Norman Powell', position: 'SG', stats: { points: 17.0, rebounds: 3.3, assists: 1.9, steals: 1.3, blocks: 0.4, fieldGoalPct: 0.443, threePointPct: 0.361, freeThrowPct: 0.880 } },
  ],

  // Kings Richmond Era 1985-1989
  '26-nba-26-1985': [
    { name: 'Reggie Theus', position: 'PG', isAllStar: true, stats: { points: 18.3, rebounds: 3.3, assists: 9.6, steals: 1.2, blocks: 0.2, fieldGoalPct: 0.474, threePointPct: 0.313, freeThrowPct: 0.849 } },
    { name: 'Mitch Richmond', position: 'SG', isLegend: true, stats: { points: 22.5, rebounds: 5.9, assists: 4.2, steals: 1.0, blocks: 0.3, fieldGoalPct: 0.468, threePointPct: 0.367, freeThrowPct: 0.810 } },
    { name: 'Wayman Tisdale', position: 'PF', stats: { points: 17.0, rebounds: 7.7, assists: 1.6, steals: 0.6, blocks: 0.6, fieldGoalPct: 0.519, threePointPct: 0.000, freeThrowPct: 0.730 } },
    { name: 'Otis Thorpe', position: 'C', isAllStar: true, stats: { points: 18.9, rebounds: 10.2, assists: 3.2, steals: 0.8, blocks: 0.4, fieldGoalPct: 0.540, threePointPct: 0.000, freeThrowPct: 0.729 } },
    { name: 'Derek Smith', position: 'SF', stats: { points: 22.1, rebounds: 5.3, assists: 3.2, steals: 1.3, blocks: 0.7, fieldGoalPct: 0.487, threePointPct: 0.267, freeThrowPct: 0.801 } },
    { name: 'LaSalle Thompson', position: 'C', stats: { points: 12.3, rebounds: 10.9, assists: 1.2, steals: 0.8, blocks: 1.1, fieldGoalPct: 0.478, threePointPct: 0.000, freeThrowPct: 0.650 } },
  ],
  // Kings Richmond Peak Era 1995-1999
  '26-nba-26-1995': [
    { name: 'Mitch Richmond', position: 'SG', isLegend: true, stats: { points: 25.9, rebounds: 3.9, assists: 4.2, steals: 1.5, blocks: 0.3, fieldGoalPct: 0.454, threePointPct: 0.428, freeThrowPct: 0.861 } },
    { name: 'Chris Webber', position: 'PF', isLegend: true, stats: { points: 20.0, rebounds: 13.0, assists: 4.1, steals: 1.4, blocks: 2.1, fieldGoalPct: 0.486, threePointPct: 0.118, freeThrowPct: 0.454 } },
    { name: 'Vlade Divac', position: 'C', isAllStar: true, stats: { points: 14.3, rebounds: 10.0, assists: 4.3, steals: 0.9, blocks: 1.0, fieldGoalPct: 0.470, threePointPct: 0.256, freeThrowPct: 0.702 } },
    { name: 'Jason Williams', position: 'PG', stats: { points: 12.8, rebounds: 3.1, assists: 6.0, steals: 1.9, blocks: 0.0, fieldGoalPct: 0.374, threePointPct: 0.310, freeThrowPct: 0.752 } },
    { name: 'Corliss Williamson', position: 'SF', stats: { points: 17.7, rebounds: 5.6, assists: 2.9, steals: 0.9, blocks: 0.3, fieldGoalPct: 0.465, threePointPct: 0.250, freeThrowPct: 0.716 } },
    { name: 'Olden Polynice', position: 'C', stats: { points: 8.9, rebounds: 9.4, assists: 0.6, steals: 0.6, blocks: 0.7, fieldGoalPct: 0.503, threePointPct: 0.000, freeThrowPct: 0.526 } },
  ],

  // Spurs Robinson Era 1990-1994
  '27-nba-27-1990': [
    { name: 'David Robinson', position: 'C', isLegend: true, stats: { points: 29.8, rebounds: 10.7, assists: 4.8, steals: 1.7, blocks: 3.3, fieldGoalPct: 0.507, threePointPct: 0.345, freeThrowPct: 0.749 } },
    { name: 'Sean Elliott', position: 'SF', isAllStar: true, stats: { points: 18.2, rebounds: 4.5, assists: 2.6, steals: 0.8, blocks: 0.4, fieldGoalPct: 0.491, threePointPct: 0.408, freeThrowPct: 0.803 } },
    { name: 'Avery Johnson', position: 'PG', stats: { points: 10.9, rebounds: 1.9, assists: 7.5, steals: 1.3, blocks: 0.1, fieldGoalPct: 0.482, threePointPct: 0.200, freeThrowPct: 0.691 } },
    { name: 'Vinny Del Negro', position: 'SG', stats: { points: 14.5, rebounds: 2.9, assists: 3.8, steals: 0.7, blocks: 0.1, fieldGoalPct: 0.486, threePointPct: 0.356, freeThrowPct: 0.828 } },
    { name: 'Dennis Rodman', position: 'PF', isLegend: true, stats: { points: 4.7, rebounds: 17.3, assists: 2.3, steals: 0.7, blocks: 0.4, fieldGoalPct: 0.534, threePointPct: 0.208, freeThrowPct: 0.520 } },
    { name: 'Willie Anderson', position: 'SG', stats: { points: 14.8, rebounds: 4.2, assists: 4.9, steals: 1.2, blocks: 0.7, fieldGoalPct: 0.482, threePointPct: 0.250, freeThrowPct: 0.748 } },
  ],
  // Spurs Kawhi Era 2015-2019
  '27-nba-27-2015': [
    { name: 'Kawhi Leonard', position: 'SF', isLegend: true, stats: { points: 25.5, rebounds: 5.8, assists: 3.5, steals: 1.8, blocks: 0.7, fieldGoalPct: 0.485, threePointPct: 0.380, freeThrowPct: 0.880 } },
    { name: 'LaMarcus Aldridge', position: 'PF', isAllStar: true, stats: { points: 23.1, rebounds: 8.5, assists: 2.0, steals: 0.6, blocks: 1.2, fieldGoalPct: 0.510, threePointPct: 0.293, freeThrowPct: 0.837 } },
    { name: 'Tony Parker', position: 'PG', isLegend: true, stats: { points: 11.9, rebounds: 2.4, assists: 5.3, steals: 0.8, blocks: 0.0, fieldGoalPct: 0.493, threePointPct: 0.415, freeThrowPct: 0.760 } },
    { name: 'Manu Ginobili', position: 'SG', isLegend: true, stats: { points: 9.6, rebounds: 2.5, assists: 3.1, steals: 1.1, blocks: 0.2, fieldGoalPct: 0.453, threePointPct: 0.391, freeThrowPct: 0.813 } },
    { name: 'Pau Gasol', position: 'C', isLegend: true, stats: { points: 12.4, rebounds: 7.8, assists: 2.3, steals: 0.4, blocks: 1.1, fieldGoalPct: 0.502, threePointPct: 0.538, freeThrowPct: 0.707 } },
    { name: 'Danny Green', position: 'SG', stats: { points: 8.6, rebounds: 3.6, assists: 1.8, steals: 1.0, blocks: 0.8, fieldGoalPct: 0.392, threePointPct: 0.376, freeThrowPct: 0.739 } },
  ],

  // Raptors Vince Era 1995-1999
  '28-nba-28-1995': [
    { name: 'Vince Carter', position: 'SG', isLegend: true, stats: { points: 25.7, rebounds: 5.8, assists: 3.9, steals: 1.3, blocks: 1.1, fieldGoalPct: 0.465, threePointPct: 0.403, freeThrowPct: 0.791 } },
    { name: 'Tracy McGrady', position: 'SF', isAllStar: true, stats: { points: 15.4, rebounds: 6.3, assists: 3.3, steals: 1.1, blocks: 1.9, fieldGoalPct: 0.451, threePointPct: 0.277, freeThrowPct: 0.707 } },
    { name: 'Damon Stoudamire', position: 'PG', stats: { points: 20.2, rebounds: 4.1, assists: 8.8, steals: 1.5, blocks: 0.2, fieldGoalPct: 0.401, threePointPct: 0.355, freeThrowPct: 0.823 } },
    { name: 'Doug Christie', position: 'SG', stats: { points: 14.5, rebounds: 5.2, assists: 3.6, steals: 2.4, blocks: 0.7, fieldGoalPct: 0.428, threePointPct: 0.323, freeThrowPct: 0.833 } },
    { name: 'Antonio Davis', position: 'PF', isAllStar: true, stats: { points: 13.7, rebounds: 10.1, assists: 1.4, steals: 0.3, blocks: 1.9, fieldGoalPct: 0.433, threePointPct: 0.000, freeThrowPct: 0.754 } },
    { name: 'Marcus Camby', position: 'C', isAllStar: true, stats: { points: 14.8, rebounds: 6.3, assists: 1.5, steals: 1.0, blocks: 2.1, fieldGoalPct: 0.482, threePointPct: 0.143, freeThrowPct: 0.693 } },
  ],
  // Raptors Barnes Era 2020-2024
  '28-nba-28-2020': [
    { name: 'Pascal Siakam', position: 'PF', isAllStar: true, stats: { points: 24.2, rebounds: 7.8, assists: 5.8, steals: 0.9, blocks: 0.5, fieldGoalPct: 0.480, threePointPct: 0.324, freeThrowPct: 0.774 } },
    { name: 'Fred VanVleet', position: 'PG', isAllStar: true, stats: { points: 20.3, rebounds: 4.4, assists: 6.7, steals: 1.7, blocks: 0.5, fieldGoalPct: 0.403, threePointPct: 0.377, freeThrowPct: 0.874 } },
    { name: 'Scottie Barnes', position: 'SF', isAllStar: true, stats: { points: 19.9, rebounds: 8.2, assists: 6.1, steals: 1.3, blocks: 1.5, fieldGoalPct: 0.475, threePointPct: 0.341, freeThrowPct: 0.781 } },
    { name: 'OG Anunoby', position: 'SF', stats: { points: 16.8, rebounds: 5.0, assists: 2.0, steals: 1.9, blocks: 0.7, fieldGoalPct: 0.476, threePointPct: 0.387, freeThrowPct: 0.838 } },
    { name: 'Gary Trent Jr.', position: 'SG', stats: { points: 18.3, rebounds: 2.7, assists: 2.0, steals: 1.7, blocks: 0.3, fieldGoalPct: 0.414, threePointPct: 0.383, freeThrowPct: 0.853 } },
    { name: 'Jakob Poeltl', position: 'C', stats: { points: 13.1, rebounds: 9.1, assists: 2.2, steals: 0.7, blocks: 1.2, fieldGoalPct: 0.652, threePointPct: 0.000, freeThrowPct: 0.569 } },
  ],

  // Jazz Eaton Era 1985-1989
  '29-nba-29-1985': [
    { name: 'Karl Malone', position: 'PF', isLegend: true, stats: { points: 29.1, rebounds: 10.7, assists: 2.7, steals: 1.8, blocks: 0.9, fieldGoalPct: 0.519, threePointPct: 0.313, freeThrowPct: 0.766 } },
    { name: 'John Stockton', position: 'PG', isLegend: true, stats: { points: 17.2, rebounds: 3.0, assists: 14.5, steals: 2.7, blocks: 0.2, fieldGoalPct: 0.514, threePointPct: 0.416, freeThrowPct: 0.819 } },
    { name: 'Thurl Bailey', position: 'SF', stats: { points: 19.6, rebounds: 5.8, assists: 1.6, steals: 0.5, blocks: 1.0, fieldGoalPct: 0.488, threePointPct: 0.000, freeThrowPct: 0.762 } },
    { name: 'Mark Eaton', position: 'C', isAllStar: true, stats: { points: 5.7, rebounds: 9.3, assists: 0.7, steals: 0.5, blocks: 4.3, fieldGoalPct: 0.449, threePointPct: 0.000, freeThrowPct: 0.640 } },
    { name: 'Darrell Griffith', position: 'SG', stats: { points: 17.2, rebounds: 3.7, assists: 2.1, steals: 1.2, blocks: 0.4, fieldGoalPct: 0.468, threePointPct: 0.370, freeThrowPct: 0.708 } },
    { name: 'Bobby Hansen', position: 'SG', stats: { points: 9.7, rebounds: 2.5, assists: 2.3, steals: 0.9, blocks: 0.1, fieldGoalPct: 0.472, threePointPct: 0.380, freeThrowPct: 0.830 } },
  ],
  // Jazz Mitchell/Gobert Era 2020-2024
  '29-nba-29-2020': [
    { name: 'Donovan Mitchell', position: 'SG', isAllStar: true, stats: { points: 26.4, rebounds: 4.4, assists: 5.2, steals: 1.0, blocks: 0.3, fieldGoalPct: 0.448, threePointPct: 0.386, freeThrowPct: 0.853 } },
    { name: 'Rudy Gobert', position: 'C', isAllStar: true, stats: { points: 15.6, rebounds: 14.7, assists: 1.1, steals: 0.7, blocks: 2.1, fieldGoalPct: 0.713, threePointPct: 0.000, freeThrowPct: 0.623 } },
    { name: 'Mike Conley', position: 'PG', stats: { points: 16.2, rebounds: 3.5, assists: 6.0, steals: 1.4, blocks: 0.2, fieldGoalPct: 0.444, threePointPct: 0.412, freeThrowPct: 0.852 } },
    { name: 'Bojan Bogdanovic', position: 'SF', stats: { points: 20.2, rebounds: 4.1, assists: 2.1, steals: 0.6, blocks: 0.1, fieldGoalPct: 0.447, threePointPct: 0.414, freeThrowPct: 0.879 } },
    { name: 'Jordan Clarkson', position: 'SG', stats: { points: 18.4, rebounds: 4.0, assists: 2.5, steals: 0.9, blocks: 0.1, fieldGoalPct: 0.425, threePointPct: 0.347, freeThrowPct: 0.896 } },
    { name: 'Lauri Markkanen', position: 'PF', isAllStar: true, stats: { points: 25.6, rebounds: 8.6, assists: 1.9, steals: 0.6, blocks: 0.6, fieldGoalPct: 0.499, threePointPct: 0.391, freeThrowPct: 0.875 } },
  ],

  // Wizards/Webber Era 1990-1994
  '30-nba-30-1990': [
    { name: 'Chris Webber', position: 'PF', isLegend: true, stats: { points: 20.1, rebounds: 9.6, assists: 4.7, steals: 1.6, blocks: 1.5, fieldGoalPct: 0.518, threePointPct: 0.397, freeThrowPct: 0.565 } },
    { name: 'Juwan Howard', position: 'SF', isAllStar: true, stats: { points: 22.1, rebounds: 8.1, assists: 4.4, steals: 0.8, blocks: 0.5, fieldGoalPct: 0.489, threePointPct: 0.308, freeThrowPct: 0.749 } },
    { name: 'Rod Strickland', position: 'PG', stats: { points: 17.8, rebounds: 5.3, assists: 10.5, steals: 1.7, blocks: 0.3, fieldGoalPct: 0.434, threePointPct: 0.250, freeThrowPct: 0.726 } },
    { name: 'Calbert Cheaney', position: 'SG', stats: { points: 16.6, rebounds: 4.1, assists: 2.3, steals: 1.0, blocks: 0.2, fieldGoalPct: 0.459, threePointPct: 0.297, freeThrowPct: 0.737 } },
    { name: 'Gheorghe Muresan', position: 'C', stats: { points: 14.5, rebounds: 9.6, assists: 0.7, steals: 0.7, blocks: 2.3, fieldGoalPct: 0.584, threePointPct: 0.000, freeThrowPct: 0.619 } },
    { name: 'Rasheed Wallace', position: 'PF', isAllStar: true, stats: { points: 10.1, rebounds: 4.7, assists: 1.3, steals: 0.6, blocks: 0.8, fieldGoalPct: 0.487, threePointPct: 0.329, freeThrowPct: 0.650 } },
  ],
  // Wizards Wall/Beal Era 2015-2019
  '30-nba-30-2015': [
    { name: 'John Wall', position: 'PG', isAllStar: true, stats: { points: 23.1, rebounds: 4.2, assists: 10.7, steals: 2.0, blocks: 0.6, fieldGoalPct: 0.451, threePointPct: 0.327, freeThrowPct: 0.801 } },
    { name: 'Bradley Beal', position: 'SG', isAllStar: true, stats: { points: 25.6, rebounds: 5.0, assists: 5.5, steals: 1.5, blocks: 0.7, fieldGoalPct: 0.475, threePointPct: 0.351, freeThrowPct: 0.808 } },
    { name: 'Otto Porter Jr.', position: 'SF', stats: { points: 14.7, rebounds: 6.4, assists: 2.0, steals: 1.5, blocks: 0.5, fieldGoalPct: 0.503, threePointPct: 0.441, freeThrowPct: 0.828 } },
    { name: 'Markieff Morris', position: 'PF', stats: { points: 14.0, rebounds: 6.5, assists: 1.7, steals: 1.1, blocks: 0.6, fieldGoalPct: 0.457, threePointPct: 0.362, freeThrowPct: 0.837 } },
    { name: 'Marcin Gortat', position: 'C', stats: { points: 13.5, rebounds: 9.9, assists: 1.4, steals: 0.6, blocks: 1.3, fieldGoalPct: 0.567, threePointPct: 0.000, freeThrowPct: 0.703 } },
    { name: 'Kelly Oubre Jr.', position: 'SF', stats: { points: 11.8, rebounds: 4.5, assists: 1.2, steals: 1.0, blocks: 0.4, fieldGoalPct: 0.403, threePointPct: 0.341, freeThrowPct: 0.820 } },
  ],
};
