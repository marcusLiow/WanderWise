import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

        const UniListPage = () => {
            const navigate = useNavigate();
            const [selectedRegion, setSelectedRegion] = useState('All');

            // University data based on SMU International Student Exchange Programme Spring 2025 document
            const universityData = [
                // Asia - China (16 universities)
                { name: 'China University of Political Science and Law', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=200&h=200&fit=crop' },
                { name: 'Fudan University Law School', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Fudan University, School of Management', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Nanjing University', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Peking University (School of International Studies)', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Renmin University of China', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Renmin University of China (School of Law)', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Shanghai Jiao Tong University', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=200&h=200&fit=crop' },
                { name: 'Shanghai Jiaotong University (KoGuan Law School)', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=200&h=200&fit=crop' },
                { name: 'Shanghai University of Finance & Economics', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=200&h=200&fit=crop' },
                { name: 'Southwestern University of Finance and Economics', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Tsinghua University, School of Economics and Management', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Tsinghua University, School of Law', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Wuhan University', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Xiamen University', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Zhejiang University', country: 'China', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },

                // Asia - Hong Kong (7 universities)
                { name: 'Chinese University of Hong Kong', country: 'Hong Kong', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'City University of Hong Kong', country: 'Hong Kong', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Hong Kong Baptist University (School of Business)', country: 'Hong Kong', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Hong Kong Polytechnic University', country: 'Hong Kong', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Hong Kong University of Science and Technology', country: 'Hong Kong', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Hong Kong University of Science and Technology (School of Humanities and Social Science)', country: 'Hong Kong', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'University of Hong Kong', country: 'Hong Kong', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },

                // Asia - Japan (14 universities)
                { name: 'Chuo University', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop' },
                { name: 'Graduate School of Economics and Faculty of Economics, Kyoto University', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=200&h=200&fit=crop' },
                { name: 'Hitotsubashi University', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop' },
                { name: 'Hokkaido University', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=200&h=200&fit=crop' },
                { name: 'Keio University', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop' },
                { name: 'Keio University (Law School)', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop' },
                { name: 'Kyushu University', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=200&h=200&fit=crop' },
                { name: 'Meiji University', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop' },
                { name: 'Nagoya University', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=200&h=200&fit=crop' },
                { name: 'Osaka University', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=200&h=200&fit=crop' },
                { name: 'Rikkyo University', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop' },
                { name: 'Rikkyo University, College of Law & Politics', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop' },
                { name: 'Sophia University', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop' },
                { name: 'Waseda University', country: 'Japan', region: 'Asia', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop' },

                // Asia - Philippines (1 university)
                { name: 'Ateneo de Manila University', country: 'Philippines', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },

                // Asia - South Korea (12 universities)
                { name: 'Chung Ang University', country: 'South Korea', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Dongguk University', country: 'South Korea', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Ewha Womans University', country: 'South Korea', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Hankuk University of Foreign Studies', country: 'South Korea', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Inha University', country: 'South Korea', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Korea University', country: 'South Korea', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Kyung Hee University', country: 'South Korea', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Pusan National University', country: 'South Korea', region: 'Asia', image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=200&h=200&fit=crop' },
                { name: 'Seoul National University', country: 'South Korea', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Sogang University', country: 'South Korea', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Sungkyunkwan University', country: 'South Korea', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Yonsei University', country: 'South Korea', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },

                // Asia - Taiwan (7 universities)
                { name: 'National Chengchi University', country: 'Taiwan', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'National Sun Yat-Sen University', country: 'Taiwan', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'National Taiwan Normal University', country: 'Taiwan', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'National Taiwan University', country: 'Taiwan', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'National Taiwan University (College of Law)', country: 'Taiwan', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'National Taiwan University (College of Management)', country: 'Taiwan', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'National Tsing Hua University', country: 'Taiwan', region: 'Asia', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },

                // Asia - Thailand (3 universities)
                { name: 'Chulalongkorn University', country: 'Thailand', region: 'Asia', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop' },
                { name: 'Mahidol University International College', country: 'Thailand', region: 'Asia', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop' },
                { name: 'Thammasat University', country: 'Thailand', region: 'Asia', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop' },

                // Central Asia - Kazakhstan (1 university)
                { name: 'KIMEP University', country: 'Kazakhstan', region: 'Central Asia', image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=200&h=200&fit=crop' },
                
                // Europe - Selected major universities (sample from different countries)
                { name: 'University of Vienna', country: 'Austria', region: 'Europe', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Vienna University of Economics and Business', country: 'Austria', region: 'Europe', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Katholieke Universiteit Leuven', country: 'Belgium', region: 'Europe', image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&h=200&fit=crop' },
                { name: 'Copenhagen Business School', country: 'Denmark', region: 'Europe', image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=200&h=200&fit=crop' },
                { name: 'HEC Paris', country: 'France', region: 'Europe', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'ESSEC Business School', country: 'France', region: 'Europe', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Sciences Po - Paris Campus', country: 'France', region: 'Europe', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'Ludwig-Maximilians-Universität', country: 'Germany', region: 'Europe', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=200&h=200&fit=crop' },
                { name: 'Technische Universitat Munchen', country: 'Germany', region: 'Europe', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=200&h=200&fit=crop' },
                { name: 'Bocconi University', country: 'Italy', region: 'Europe', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'University of Amsterdam', country: 'Netherlands', region: 'Europe', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=200&h=200&fit=crop' },
                { name: 'Maastricht University School of Business and Economics', country: 'Netherlands', region: 'Europe', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=200&h=200&fit=crop' },
                { name: 'ESADE', country: 'Spain', region: 'Europe', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=200&h=200&fit=crop' },
                { name: 'IE University', country: 'Spain', region: 'Europe', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=200&h=200&fit=crop' },
                { name: 'Stockholm School of Economics', country: 'Sweden', region: 'Europe', image: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=200&h=200&fit=crop' },
                { name: 'KTH Royal Institute of Technology', country: 'Sweden', region: 'Europe', image: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=200&h=200&fit=crop' },
                { name: 'University of St Gallen', country: 'Switzerland', region: 'Europe', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop' },
                { name: 'University of Zurich', country: 'Switzerland', region: 'Europe', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop' },
                { name: 'King\'s College London', country: 'United Kingdom', region: 'Europe', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&h=200&fit=crop' },
                { name: 'University College London, School of Management', country: 'United Kingdom', region: 'Europe', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&h=200&fit=crop' },
                { name: 'University of Edinburgh', country: 'United Kingdom', region: 'Europe', image: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=200&h=200&fit=crop' },
                { name: 'University of Manchester', country: 'United Kingdom', region: 'Europe', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&h=200&fit=crop' },

                // Middle East - Turkey (2 universities)
                { name: 'KOC University', country: 'Turkey', region: 'Middle East', image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=200&h=200&fit=crop' },
                { name: 'Sabanci University', country: 'Turkey', region: 'Middle East', image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=200&h=200&fit=crop' },
                
                // North America - Canada (9 universities)
                { name: 'McGill University', country: 'Canada', region: 'North America', image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop' }, // Montreal cityscape
                { name: 'University of British Columbia', country: 'Canada', region: 'North America', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80' }, // Vancouver mountains and city
                { name: 'University of Toronto', country: 'Canada', region: 'North America', image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop&q=80' }, // Toronto skyline
                { name: 'Queens University', country: 'Canada', region: 'North America', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop' }, // Kingston, Ontario heritage architecture
                { name: 'HEC Montreal', country: 'Canada', region: 'North America', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop' }, // Montreal business district
                { name: 'Concordia University', country: 'Canada', region: 'North America', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=70' }, // Montreal downtown
                { name: 'University of Calgary', country: 'Canada', region: 'North America', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' }, // Calgary with Rocky Mountains
                { name: 'York University, Schulich School of Business', country: 'Canada', region: 'North America', image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop&q=60' }, // Toronto area
                { name: 'Simon Fraser University (Beedie School of Business)', country: 'Canada', region: 'North America', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=80' }, // Vancouver/Burnaby mountain view

                // North America - USA (12 universities)
                { name: 'University of Pennsylvania (Wharton School)', country: 'United States', region: 'North America', image: 'https://picsum.photos/400/300?random=1' },
                { name: 'University of Michigan, Ross School of Business', country: 'United States', region: 'North America', image: 'https://picsum.photos/400/300?random=2' },
                { name: 'University of Southern California (Marshall School of Business)', country: 'United States', region: 'North America', image: 'https://picsum.photos/400/300?random=3' },
                { name: 'Northeastern University', country: 'United States', region: 'North America', image: 'https://picsum.photos/400/300?random=4' },
                { name: 'University of Maryland', country: 'United States', region: 'North America', image: 'https://picsum.photos/400/300?random=5' },
                { name: 'University of Minnesota', country: 'United States', region: 'North America', image: 'https://picsum.photos/400/300?random=6' },
                { name: 'Arizona State University', country: 'United States', region: 'North America', image: 'https://picsum.photos/400/300?random=7' },
                { name: 'Babson College', country: 'United States', region: 'North America', image: 'https://picsum.photos/400/300?random=8' },
                { name: 'City University of New York - Baruch College', country: 'United States', region: 'North America', image: 'https://picsum.photos/400/300?random=9' },
                { name: 'Oregon State University', country: 'United States', region: 'North America', image: 'https://picsum.photos/400/300?random=10' },
                { name: 'University of North Carolina, Chapel Hill', country: 'United States', region: 'North America', image: 'https://picsum.photos/400/300?random=11' },
                { name: 'Washington University in St. Louis', country: 'United States', region: 'North America', image: 'https://picsum.photos/400/300?random=12' },

                // Oceania - Australia (1 university)
                { name: 'Australian National University', country: 'Australia', region: 'Oceania', image: 'https://picsum.photos/400/300?random=13' },

                // South America - Brazil (1 university)
                { name: 'Insper Institute of Education and Research', country: 'Brazil', region: 'South America', image: 'https://picsum.photos/400/300?random=14' }];

            const regions = ['All', 'Asia', 'Europe', 'North America', 'Middle East', 'Central Asia', 'Oceania', 'South America'];

            const filteredData = useMemo(() => {
                if (selectedRegion === 'All') {
                    return universityData.sort((a, b) => a.name.localeCompare(b.name));
                }
                return universityData.filter(item => item.region === selectedRegion).sort((a, b) => a.name.localeCompare(b.name));
            }, [selectedRegion]);

            // Navigation function
            const handleDestinationClick = (destinationName) => {
                // Navigate to search results page with the destination name as query parameter
                navigate(`/search?q=${encodeURIComponent(destinationName)}`);
            };

            const styles = {
                container: {
                    fontFamily: 'Arial, sans-serif',
                    lineHeight: '1.6',
                    color: '#333',
                    minHeight: '100vh',
                    backgroundColor: '#f8f9fa'
                },
                header: {
                    background: 'linear-gradient(135deg, #ff3f00 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '60px 20px',
                    textAlign: 'center'
                },
                title: {
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                },
                subtitle: {
                    fontSize: '1.2rem',
                    opacity: '0.9',
                    maxWidth: '600px',
                    margin: '0 auto'
                },
                filterSection: {
                    backgroundColor: 'white',
                    padding: '30px 20px',
                    borderBottom: '1px solid #e0e0e0'
                },
                filterContainer: {
                    maxWidth: '1200px',
                    margin: '0 auto',
                    textAlign: 'center'
                },
                filterTitle: {
                    fontSize: '1.2rem',
                    marginBottom: '20px',
                    color: '#333'
                },
                filterButtons: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    justifyContent: 'center'
                },
                filterButton: {
                    padding: '10px 20px',
                    border: '2px solid #ff3f00',
                    borderRadius: '25px',
                    backgroundColor: 'white',
                    color: '#ff3f00',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                },
                filterButtonActive: {
                    padding: '10px 20px',
                    border: '2px solid #ff3f00',
                    borderRadius: '25px',
                    backgroundColor: '#ff3f00',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                },
                graySection: {
                    backgroundColor: '#f8f9fa',
                    padding: '60px 0'
                },
                section: {
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px'
                },
                sectionTitle: {
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    color: '#333'
                },
                sectionSubtitle: {
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    color: '#666',
                    marginBottom: '3rem',
                    maxWidth: '600px',
                    margin: '0 auto 3rem'
                },
                grid: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px',
                    marginTop: '30px'
                },
                destinationCard: {
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                },
                destinationImage: {
                    width: '100%',
                    height: '200px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                },
                destinationContent: {
                    padding: '20px'
                },
                stats: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '20px',
                    marginTop: '40px',
                    padding: '0 20px'
                },
                statCard: {
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                },
                statNumber: {
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#ff3f00',
                    marginBottom: '10px'
                },
                statLabel: {
                    fontSize: '0.9rem',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }
            };

            const totalUniversities = universityData.length;
            const totalCountries = [...new Set(universityData.map(item => item.country))].length;

            return (
                <div style={styles.container}>
                    {/* Header */}
                    <header style={styles.header}>
                        <h1 style={styles.title}>Partner Universities</h1>
                        <p style={styles.subtitle}>
                            Discover amazing opportunities at top universities worldwide through SMU's International Student Exchange Programme
                        </p>
                        
                        {/* Stats */}
                        <div style={styles.stats}>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{totalUniversities}</div>
                                <div style={styles.statLabel}>Universities</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{totalCountries}</div>
                                <div style={styles.statLabel}>Countries</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{regions.length - 1}</div>
                                <div style={styles.statLabel}>Regions</div>
                            </div>
                        </div>
                    </header>

                    {/* Filter Section */}
                    <div style={styles.filterSection}>
                        <div style={styles.filterContainer}>
                            <h3 style={styles.filterTitle}>Filter by Region</h3>
                            <div style={styles.filterButtons}>
                                {regions.map(region => (
                                    <button
                                        key={region}
                                        style={selectedRegion === region ? styles.filterButtonActive : styles.filterButton}
                                        onClick={() => setSelectedRegion(region)}
                                        onMouseOver={(e) => {
                                            if (selectedRegion !== region) {
                                                e.target.style.backgroundColor = '#f0f0f0';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (selectedRegion !== region) {
                                                e.target.style.backgroundColor = 'white';
                                            }
                                        }}
                                    >
                                        {region}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Universities Grid */}
                    <section style={styles.graySection}>
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>
                                {selectedRegion === 'All' ? 'All Universities' : `${selectedRegion} Universities`}
                            </h2>
                            <p style={styles.sectionSubtitle}>
                                Explore top-rated universities from around the world
                            </p>

                            <div style={styles.grid}>
                                {filteredData.map((university, index) => (
                                    <div 
                                        key={index} 
                                        style={styles.destinationCard}
                                        onClick={() => handleDestinationClick(university.name)}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                                        }}
                                    >
                                        <div style={{
                                            ...styles.destinationImage,
                                            backgroundImage: `url(${university.image})`
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                background: 'rgba(0,0,0,0.3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <h3 style={{ 
                                                    color: 'white', 
                                                    fontSize: '1.3rem', 
                                                    fontWeight: 'bold',
                                                    margin: 0,
                                                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                                                    textAlign: 'center',
                                                    padding: '0 10px'
                                                }}>
                                                    {university.name}
                                                </h3>
                                            </div>
                                        </div>
                                        <div style={styles.destinationContent}>
                                            <p style={{ color: '#666', margin: 0, fontWeight: '500' }}>
                                                {university.country}
                                            </p>
                                            <p style={{ color: '#888', fontSize: '0.9rem', margin: '5px 0 0 0' }}>
                                                {university.region}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            );
        };

        export default UniListPage;
