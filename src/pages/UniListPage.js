import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

        const UniListPage = () => {
            const navigate = useNavigate();
            const [selectedRegion, setSelectedRegion] = useState('All');

            // University data based on SMU International Student Exchange Programme Spring 2025 document
            const universityData = [
                // Asia - China (16 universities)
                { name: 'China University of Political Science and Law', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/1f2937/ffffff?text=CUPL' },
                { name: 'Fudan University Law School', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/dc2626/ffffff?text=FUDAN' },
                { name: 'Fudan University, School of Management', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/dc2626/ffffff?text=FUDAN' },
                { name: 'Nanjing University', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/7c3aed/ffffff?text=NJU' },
                { name: 'Peking University (School of International Studies)', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/b91c1c/ffffff?text=PKU' },
                { name: 'Renmin University of China', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/059669/ffffff?text=RUC' },
                { name: 'Renmin University of China (School of Law)', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/059669/ffffff?text=RUC' },
                { name: 'Shanghai Jiao Tong University', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/2563eb/ffffff?text=SJTU' },
                { name: 'Shanghai Jiaotong University (KoGuan Law School)', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/2563eb/ffffff?text=SJTU' },
                { name: 'Shanghai University of Finance & Economics', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/ea580c/ffffff?text=SUFE' },
                { name: 'Southwestern University of Finance and Economics', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/0891b2/ffffff?text=SWUFE' },
                { name: 'Tsinghua University, School of Economics and Management', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/7c2d12/ffffff?text=THU' },
                { name: 'Tsinghua University, School of Law', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/7c2d12/ffffff?text=THU' },
                { name: 'Wuhan University', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/a21caf/ffffff?text=WHU' },
                { name: 'Xiamen University', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/0d9488/ffffff?text=XMU' },
                { name: 'Zhejiang University', country: 'China', region: 'Asia', image: 'https://via.placeholder.com/200x200/1e40af/ffffff?text=ZJU' },

                // Asia - Hong Kong (7 universities)
                { name: 'Chinese University of Hong Kong', country: 'Hong Kong', region: 'Asia', image: 'https://via.placeholder.com/200x200/7c3aed/ffffff?text=CUHK' },
                { name: 'City University of Hong Kong', country: 'Hong Kong', region: 'Asia', image: 'https://via.placeholder.com/200x200/059669/ffffff?text=CityU' },
                { name: 'Hong Kong Baptist University (School of Business)', country: 'Hong Kong', region: 'Asia', image: 'https://via.placeholder.com/200x200/dc2626/ffffff?text=HKBU' },
                { name: 'Hong Kong Polytechnic University', country: 'Hong Kong', region: 'Asia', image: 'https://via.placeholder.com/200x200/b91c1c/ffffff?text=PolyU' },
                { name: 'Hong Kong University of Science and Technology', country: 'Hong Kong', region: 'Asia', image: 'https://via.placeholder.com/200x200/2563eb/ffffff?text=HKUST' },
                { name: 'Hong Kong University of Science and Technology (School of Humanities and Social Science)', country: 'Hong Kong', region: 'Asia', image: 'https://via.placeholder.com/200x200/2563eb/ffffff?text=HKUST' },
                { name: 'University of Hong Kong', country: 'Hong Kong', region: 'Asia', image: 'https://via.placeholder.com/200x200/0891b2/ffffff?text=HKU' },
                
                // Asia - Japan (14 universities)
                { name: 'Chuo University', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/dc2626/ffffff?text=CHUO' },
                { name: 'Graduate School of Economics and Faculty of Economics, Kyoto University', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/7c2d12/ffffff?text=KYOTO' },
                { name: 'Hitotsubashi University', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/1e40af/ffffff?text=HIT' },
                { name: 'Hokkaido University', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/0d9488/ffffff?text=HOKUDAI' },
                { name: 'Keio University', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/2563eb/ffffff?text=KEIO' },
                { name: 'Keio University (Law School)', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/2563eb/ffffff?text=KEIO' },
                { name: 'Kyushu University', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/a21caf/ffffff?text=KYUSHU' },
                { name: 'Meiji University', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/7c3aed/ffffff?text=MEIJI' },
                { name: 'Nagoya University', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/ea580c/ffffff?text=NAGOYA' },
                { name: 'Osaka University', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/059669/ffffff?text=OSAKA' },
                { name: 'Rikkyo University', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/b91c1c/ffffff?text=RIKKYO' },
                { name: 'Rikkyo University, College of Law & Politics', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/b91c1c/ffffff?text=RIKKYO' },
                { name: 'Sophia University', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/0891b2/ffffff?text=SOPHIA' },
                { name: 'Waseda University', country: 'Japan', region: 'Asia', image: 'https://via.placeholder.com/200x200/dc2626/ffffff?text=WASEDA' },
    
                // Asia - Philippines (1 university)
                { name: 'Ateneo de Manila University', country: 'Philippines', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Ateneo_de_Manila_University_Logo.svg/200px-Ateneo_de_Manila_University_Logo.svg.png' },
                
                // Asia - South Korea (12 universities)
                { name: 'Chung Ang University', country: 'South Korea', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Chung-Ang_University_Logo.svg/200px-Chung-Ang_University_Logo.svg.png' },
                { name: 'Dongguk University', country: 'South Korea', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Dongguk_University_Logo.svg/200px-Dongguk_University_Logo.svg.png' },
                { name: 'Ewha Womans University', country: 'South Korea', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Ewha_Womans_University_Logo.svg/200px-Ewha_Womans_University_Logo.svg.png' },
                { name: 'Hankuk University of Foreign Studies', country: 'South Korea', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Hankuk_University_of_Foreign_Studies_Logo.svg/200px-Hankuk_University_of_Foreign_Studies_Logo.svg.png' },
                { name: 'Inha University', country: 'South Korea', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Inha_University_Logo.svg/200px-Inha_University_Logo.svg.png' },
                { name: 'Korea University', country: 'South Korea', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Korea_University_Logo.svg/200px-Korea_University_Logo.svg.png' },
                { name: 'Kyung Hee University', country: 'South Korea', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Kyung_Hee_University_Logo.svg/200px-Kyung_Hee_University_Logo.svg.png' },
                { name: 'Pusan National University', country: 'South Korea', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Pusan_National_University_Logo.svg/200px-Pusan_National_University_Logo.svg.png' },
                { name: 'Seoul National University', country: 'South Korea', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Seoul_National_University_Logo.svg/200px-Seoul_National_University_Logo.svg.png' },
                { name: 'Sogang University', country: 'South Korea', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Sogang_University_Logo.svg/200px-Sogang_University_Logo.svg.png' },
                { name: 'Sungkyunkwan University', country: 'South Korea', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Sungkyunkwan_University_Logo.svg/200px-Sungkyunkwan_University_Logo.svg.png' },
                { name: 'Yonsei University', country: 'South Korea', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Yonsei_University_Logo.svg/200px-Yonsei_University_Logo.svg.png' },
                
                // Asia - Taiwan (7 universities)
                { name: 'National Chengchi University', country: 'Taiwan', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/National_Chengchi_University_Logo.svg/200px-National_Chengchi_University_Logo.svg.png' },
                { name: 'National Sun Yat-Sen University', country: 'Taiwan', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/National_Sun_Yat-sen_University_Logo.svg/200px-National_Sun_Yat-sen_University_Logo.svg.png' },
                { name: 'National Taiwan Normal University', country: 'Taiwan', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/National_Taiwan_Normal_University_Logo.svg/200px-National_Taiwan_Normal_University_Logo.svg.png' },
                { name: 'National Taiwan University', country: 'Taiwan', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/National_Taiwan_University_Logo.svg/200px-National_Taiwan_University_Logo.svg.png' },
                { name: 'National Taiwan University (College of Law)', country: 'Taiwan', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/National_Taiwan_University_Logo.svg/200px-National_Taiwan_University_Logo.svg.png' },
                { name: 'National Taiwan University (College of Management)', country: 'Taiwan', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/National_Taiwan_University_Logo.svg/200px-National_Taiwan_University_Logo.svg.png' },
                { name: 'National Tsing Hua University', country: 'Taiwan', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/National_Tsing_Hua_University_Logo.svg/200px-National_Tsing_Hua_University_Logo.svg.png' },
                
                // Asia - Thailand (3 universities)
                { name: 'Chulalongkorn University', country: 'Thailand', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Chulalongkorn_University_Logo.svg/200px-Chulalongkorn_University_Logo.svg.png' },
                { name: 'Mahidol University International College', country: 'Thailand', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Mahidol_University_Logo.svg/200px-Mahidol_University_Logo.svg.png' },
                { name: 'Thammasat University', country: 'Thailand', region: 'Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Thammasat_University_Logo.svg/200px-Thammasat_University_Logo.svg.png' },
                
                // Central Asia - Kazakhstan (1 university)
                { name: 'KIMEP University', country: 'Kazakhstan', region: 'Central Asia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/KIMEP_University_Logo.png/200px-KIMEP_University_Logo.png' },
                
                // Europe - Selected major universities (sample from different countries)
                { name: 'University of Vienna', country: 'Austria', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/University_of_Vienna_Logo.svg/200px-University_of_Vienna_Logo.svg.png' },
                { name: 'Vienna University of Economics and Business', country: 'Austria', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Vienna_University_of_Economics_and_Business_Logo.svg/200px-Vienna_University_of_Economics_and_Business_Logo.svg.png' },
                { name: 'Katholieke Universiteit Leuven', country: 'Belgium', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/KU_Leuven_Logo.svg/200px-KU_Leuven_Logo.svg.png' },
                { name: 'Copenhagen Business School', country: 'Denmark', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Copenhagen_Business_School_Logo.svg/200px-Copenhagen_Business_School_Logo.svg.png' },
                { name: 'HEC Paris', country: 'France', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/HEC_Paris_Logo.svg/200px-HEC_Paris_Logo.svg.png' },
                { name: 'ESSEC Business School', country: 'France', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/ESSEC_Business_School_Logo.svg/200px-ESSEC_Business_School_Logo.svg.png' },
                { name: 'Sciences Po - Paris Campus', country: 'France', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Sciences_Po_Logo.svg/200px-Sciences_Po_Logo.svg.png' },
                { name: 'Ludwig-Maximilians-Universität', country: 'Germany', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Ludwig_Maximilian_University_of_Munich_Logo.svg/200px-Ludwig_Maximilian_University_of_Munich_Logo.svg.png' },
                { name: 'Technische Universitat Munchen', country: 'Germany', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Technical_University_of_Munich_Logo.svg/200px-Technical_University_of_Munich_Logo.svg.png' },
                { name: 'Bocconi University', country: 'Italy', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bocconi_University_Logo.svg/200px-Bocconi_University_Logo.svg.png' },
                { name: 'University of Amsterdam', country: 'Netherlands', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/University_of_Amsterdam_Logo.svg/200px-University_of_Amsterdam_Logo.svg.png' },
                { name: 'Maastricht University School of Business and Economics', country: 'Netherlands', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Maastricht_University_Logo.svg/200px-Maastricht_University_Logo.svg.png' },
                { name: 'ESADE', country: 'Spain', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/ESADE_Logo.svg/200px-ESADE_Logo.svg.png' },
                { name: 'IE University', country: 'Spain', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/IE_University_Logo.svg/200px-IE_University_Logo.svg.png' },
                { name: 'Stockholm School of Economics', country: 'Sweden', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Stockholm_School_of_Economics_Logo.svg/200px-Stockholm_School_of_Economics_Logo.svg.png' },
                { name: 'KTH Royal Institute of Technology', country: 'Sweden', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/KTH_Royal_Institute_of_Technology_Logo.svg/200px-KTH_Royal_Institute_of_Technology_Logo.svg.png' },
                { name: 'University of St Gallen', country: 'Switzerland', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/University_of_St_Gallen_Logo.svg/200px-University_of_St_Gallen_Logo.svg.png' },
                { name: 'University of Zurich', country: 'Switzerland', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/University_of_Zurich_Logo.svg/200px-University_of_Zurich_Logo.svg.png' },
                { name: 'King\'s College London', country: 'United Kingdom', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/King%27s_College_London_Logo.svg/200px-King%27s_College_London_Logo.svg.png' },
                { name: 'University College London, School of Management', country: 'United Kingdom', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/University_College_London_Logo.svg/200px-University_College_London_Logo.svg.png' },
                { name: 'University of Edinburgh', country: 'United Kingdom', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/University_of_Edinburgh_Logo.svg/200px-University_of_Edinburgh_Logo.svg.png' },
                { name: 'University of Manchester', country: 'United Kingdom', region: 'Europe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/University_of_Manchester_Logo.svg/200px-University_of_Manchester_Logo.svg.png' },
                
                // Middle East - Turkey (2 universities)
                { name: 'KOC University', country: 'Turkey', region: 'Middle East', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Koc_University_Logo.svg/200px-Koc_University_Logo.svg.png' },
                { name: 'Sabanci University', country: 'Turkey', region: 'Middle East', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Sabanci_University_Logo.svg/200px-Sabanci_University_Logo.svg.png' },
                
                // North America - Canada (9 universities)
                { name: 'McGill University', country: 'Canada', region: 'North America', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/McGill_University_Logo.svg/200px-McGill_University_Logo.svg.png' },
                { name: 'University of British Columbia', country: 'Canada', region: 'North America', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/University_of_British_Columbia_Logo.svg/200px-University_of_British_Columbia_Logo.svg.png' },
                { name: 'University of Toronto', country: 'Canada', region: 'North America', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/University_of_Toronto_Logo.svg/200px-University_of_Toronto_Logo.svg.png' },
                { name: 'Queens University', country: 'Canada', region: 'North America', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Queen%27s_University_Logo.svg/200px-Queen%27s_University_Logo.svg.png' },
                { name: 'HEC Montreal', country: 'Canada', region: 'North America', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/HEC_Montreal_Logo.svg/200px-HEC_Montreal_Logo.svg.png' },
                { name: 'Concordia University', country: 'Canada', region: 'North America', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Concordia_University_Logo.svg/200px-Concordia_University_Logo.svg.png' },
                { name: 'University of Calgary', country: 'Canada', region: 'North America', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/University_of_Calgary_Logo.svg/200px-University_of_Calgary_Logo.svg.png' },
                { name: 'York University, Schulich School of Business', country: 'Canada', region: 'North America', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/York_University_Logo.svg/200px-York_University_Logo.svg.png' },
                { name: 'Simon Fraser University (Beedie School of Business)', country: 'Canada', region: 'North America', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Simon_Fraser_University_Logo.svg/200px-Simon_Fraser_University_Logo.svg.png' },

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
