-- Insert scripts for universities from SMU International Student Exchange Programme
-- Based on iGPA Spring 2025 data

-- Insert countries first (expanding the existing list)
INSERT INTO countries (name, flag) VALUES
('China', '/images/china-flag.png'),
('Hong Kong', '/images/hong-kong-flag.png'),
('Japan', '/images/japan-flag.png'),
('Philippines', '/images/philippines-flag.png'),
('South Korea', '/images/south-korea-flag.png'),
('Taiwan', '/images/taiwan-flag.png'),
('Thailand', '/images/thailand-flag.png'),
('Kazakhstan', '/images/kazakhstan-flag.png'),
('Austria', '/images/austria-flag.png'),
('Belgium', '/images/belgium-flag.png'),
('Czech Republic', '/images/czech-flag.png'),
('Denmark', '/images/denmark-flag.png'),
('Finland', '/images/finland-flag.png'),
('Hungary', '/images/hungary-flag.png'),
('Iceland', '/images/iceland-flag.png'),
('Ireland', '/images/ireland-flag.png'),
('Lithuania', '/images/lithuania-flag.png'),
('Norway', '/images/norway-flag.png'),
('Poland', '/images/poland-flag.png'),
('Portugal', '/images/portugal-flag.png'),
('Sweden', '/images/sweden-flag.png'),
('Switzerland', '/images/switzerland-flag.png'),
('Netherlands', '/images/netherlands-flag.png'),
('Turkey', '/images/turkey-flag.png'),
('Canada', '/images/canada-flag.png'),
('United States', '/images/usa-flag.png'),
('Australia', '/images/australia-flag.png'),
('Brazil', '/images/brazil-flag.png');

-- Insert universities with descriptions
INSERT INTO universities (name, description, logo, country, flag, rating) VALUES

-- CHINA
('China University of Political Science and Law', 
'China University of Political Science and Law (CUPL) is a prestigious national university in Beijing specializing in law, politics, and social sciences. Founded in 1952, it is one of China\'s top law schools and has produced numerous legal professionals, judges, and government officials. The university offers comprehensive programs in law, political science, and international relations.',
'/images/cupl-logo.png', 'China', '/images/china-flag.png', 4.2),

('Fudan University Law School', 
'Fudan University Law School is part of one of China\'s most prestigious universities, located in Shanghai. Established in 1929, Fudan Law School is renowned for its rigorous academic programs and influential alumni in China\'s legal and political spheres. The school offers comprehensive legal education with strong emphasis on both domestic and international law.',
'/images/fudan-law-logo.png', 'China', '/images/china-flag.png', 4.6),

('Fudan University School of Management', 
'Fudan University School of Management is one of China\'s leading business schools, located in Shanghai. Founded in 1985, it offers world-class business education with strong industry connections and international partnerships. The school is known for its innovative MBA programs and research excellence in management studies.',
'/images/fudan-management-logo.png', 'China', '/images/china-flag.png', 4.5),

('Nanjing University', 
'Nanjing University is one of China\'s oldest and most prestigious institutions, founded in 1902. Located in Nanjing, it is a comprehensive research university known for excellence in sciences, humanities, and social sciences. The university has a beautiful campus and rich history, making it a top choice for international students.',
'/images/nanjing-logo.png', 'China', '/images/china-flag.png', 4.4),

('Peking University School of International Studies', 
'Peking University School of International Studies is part of China\'s most prestigious university, located in Beijing. Founded in 1960, it is China\'s premier institution for international relations and area studies. The school offers comprehensive programs in international politics, economics, and regional studies with a global perspective.',
'/images/pku-sis-logo.png', 'China', '/images/china-flag.png', 4.8),

('Renmin University of China', 
'Renmin University of China, established in 1950, is a leading research university in Beijing known for its strength in humanities and social sciences. Often called the "cradle of China\'s humanistic and social sciences," it offers excellent programs in economics, law, journalism, and public administration.',
'/images/ruc-logo.png', 'China', '/images/china-flag.png', 4.3),

('Renmin University of China School of Law', 
'Renmin University of China School of Law is one of China\'s top law schools, established in 1950. Located in Beijing, it is renowned for its comprehensive legal education and has produced many influential legal scholars and practitioners. The school offers strong programs in both Chinese and international law.',
'/images/ruc-law-logo.png', 'China', '/images/china-flag.png', 4.4),

('Shanghai Jiao Tong University', 
'Shanghai Jiao Tong University (SJTU) is one of China\'s oldest and most prestigious universities, founded in 1896. Located in Shanghai, it is renowned for engineering, business, and medicine. SJTU consistently ranks among the top universities in China and Asia, offering world-class education and research opportunities.',
'/images/sjtu-logo.png', 'China', '/images/china-flag.png', 4.6),

('Shanghai Jiaotong University KoGuan Law School', 
'Shanghai Jiaotong University KoGuan Law School is a leading law school in China, established in 2008. Located in Shanghai, it offers innovative legal education with a focus on business law and international legal practice. The school is known for its modern facilities and strong industry connections.',
'/images/sjtu-law-logo.png', 'China', '/images/china-flag.png', 4.5),

('Shanghai University of Finance and Economics', 
'Shanghai University of Finance and Economics (SUFE) is China\'s premier institution for finance and economics education, founded in 1917. Located in Shanghai, it is renowned for its programs in finance, accounting, and economics. SUFE has strong connections with China\'s financial industry and offers excellent career opportunities.',
'/images/sufe-logo.png', 'China', '/images/china-flag.png', 4.4),

('Southwestern University of Finance and Economics', 
'Southwestern University of Finance and Economics (SWUFE) is a leading finance and economics university in China, established in 1925. Located in Chengdu, it is known for its strong programs in finance, economics, and management. The university has a beautiful campus and offers comprehensive business education.',
'/images/swufe-logo.png', 'China', '/images/china-flag.png', 4.2),

('Tsinghua University School of Economics and Management', 
'Tsinghua University School of Economics and Management is one of China\'s top business schools, part of the prestigious Tsinghua University. Founded in 1984, it offers world-class business education with strong emphasis on innovation and entrepreneurship. The school has excellent industry connections and international partnerships.',
'/images/tsinghua-sem-logo.png', 'China', '/images/china-flag.png', 4.7),

('Tsinghua University School of Law', 
'Tsinghua University School of Law is part of China\'s top technical university, established in 1999. Located in Beijing, it offers innovative legal education with focus on technology law and intellectual property. The school combines Tsinghua\'s engineering excellence with comprehensive legal training.',
'/images/tsinghua-law-logo.png', 'China', '/images/china-flag.png', 4.6),

('Wuhan University', 
'Wuhan University is one of China\'s most prestigious universities, founded in 1893. Located in Wuhan, it is famous for its beautiful campus with cherry blossoms and comprehensive academic programs. The university excels in law, economics, and international relations, offering rich cultural experiences.',
'/images/whu-logo.png', 'China', '/images/china-flag.png', 4.5),

('Xiamen University', 
'Xiamen University is one of China\'s most beautiful universities, founded in 1921. Located in the coastal city of Xiamen, it offers stunning campus views and excellent academic programs. The university is known for its strong programs in economics, management, and marine sciences.',
'/images/xmu-logo.png', 'China', '/images/china-flag.png', 4.3),

('Zhejiang University', 
'Zhejiang University is one of China\'s oldest and most prestigious universities, founded in 1897. Located in Hangzhou, it is a comprehensive research university known for excellence in engineering, sciences, and management. The university offers beautiful campus environments and innovative academic programs.',
'/images/zju-logo.png', 'China', '/images/china-flag.png', 4.5),

-- HONG KONG
('Chinese University of Hong Kong', 
'The Chinese University of Hong Kong (CUHK) is a prestigious research university founded in 1963. Located in Sha Tin with stunning mountain and sea views, CUHK offers bilingual education and is known for its strong programs in business, medicine, and social sciences. The university combines Eastern and Western educational traditions.',
'/images/cuhk-logo.png', 'Hong Kong', '/images/hong-kong-flag.png', 4.5),

('City University of Hong Kong', 
'City University of Hong Kong (CityU) is a leading research university established in 1984. Located in Kowloon Tong, it is known for its professional education and applied research. CityU offers innovative programs in business, engineering, and creative media with strong industry connections.',
'/images/cityu-logo.png', 'Hong Kong', '/images/hong-kong-flag.png', 4.3),

('Hong Kong Baptist University School of Business', 
'Hong Kong Baptist University School of Business is a well-regarded business school established in 1956. Located in Kowloon Tong, it offers comprehensive business education with strong emphasis on ethical leadership and social responsibility. The school has excellent industry connections and practical learning opportunities.',
'/images/hkbu-business-logo.png', 'Hong Kong', '/images/hong-kong-flag.png', 4.2),

('Hong Kong Polytechnic University', 
'The Hong Kong Polytechnic University (PolyU) is a leading university for professional education, founded in 1972. Located in Hung Hom, it is renowned for its applied research and industry partnerships. PolyU offers innovative programs in engineering, business, design, and hospitality management.',
'/images/polyu-logo.png', 'Hong Kong', '/images/hong-kong-flag.png', 4.4),

('Hong Kong University of Science and Technology', 
'The Hong Kong University of Science and Technology (HKUST) is a world-class research university founded in 1991. Located in Clear Water Bay with spectacular sea views, HKUST is renowned for its programs in science, engineering, and business. The university consistently ranks among the top in Asia.',
'/images/hkust-logo.png', 'Hong Kong', '/images/hong-kong-flag.png', 4.7),

('Hong Kong University of Science and Technology School of Humanities and Social Science', 
'HKUST School of Humanities and Social Science offers interdisciplinary programs combining humanities and social sciences. The school is known for its innovative approach to liberal arts education and strong research programs in social sciences, providing students with critical thinking skills and global perspectives.',
'/images/hkust-shss-logo.png', 'Hong Kong', '/images/hong-kong-flag.png', 4.5),

('University of Hong Kong', 
'The University of Hong Kong (HKU) is Hong Kong\'s oldest university, founded in 1911. Located in Pokfulam, it is consistently ranked as one of the top universities in Asia. HKU offers comprehensive programs across all disciplines and is known for its excellent teaching, research, and beautiful historic campus.',
'/images/hku-logo.png', 'Hong Kong', '/images/hong-kong-flag.png', 4.6),

-- JAPAN
('Chuo University', 
'Chuo University is a prestigious private university in Tokyo, founded in 1885. Known for its strong programs in law, economics, and commerce, Chuo University has produced many influential business leaders and politicians. The university offers excellent facilities and maintains strong industry connections.',
'/images/chuo-logo.png', 'Japan', '/images/japan-flag.png', 4.2),

('Kyoto University Graduate School of Economics', 
'Kyoto University Graduate School of Economics is part of one of Japan\'s most prestigious national universities, founded in 1897. Located in the historic city of Kyoto, it offers world-class economics education and research. The school is known for its rigorous academic standards and beautiful campus.',
'/images/kyoto-econ-logo.png', 'Japan', '/images/japan-flag.png', 4.6),

('Hitotsubashi University', 
'Hitotsubashi University is Japan\'s premier institution for commerce and economics, established in 1875. Located in Tokyo, it is renowned for its business and social science programs. The university has a small, selective student body and maintains strong connections with Japan\'s business and government sectors.',
'/images/hitotsubashi-logo.png', 'Japan', '/images/japan-flag.png', 4.5),

('Hokkaido University', 
'Hokkaido University is one of Japan\'s top national universities, founded in 1876. Located in Sapporo, it offers comprehensive programs across all disciplines with beautiful campus grounds. The university is known for its research excellence and international outlook, providing students with diverse academic opportunities.',
'/images/hokudai-logo.png', 'Japan', '/images/japan-flag.png', 4.4),

('Keio University', 
'Keio University is one of Japan\'s oldest and most prestigious private universities, founded in 1858. Located in Tokyo, it is renowned for its programs in economics, law, and medicine. Keio has produced many influential business leaders and offers excellent international programs.',
'/images/keio-logo.png', 'Japan', '/images/japan-flag.png', 4.6),

('Keio University Law School', 
'Keio University Law School is part of Japan\'s most prestigious private university, offering comprehensive legal education. Established as part of Keio\'s long tradition in legal studies, the law school is known for its rigorous curriculum and strong alumni network in Japan\'s legal profession.',
'/images/keio-law-logo.png', 'Japan', '/images/japan-flag.png', 4.5),

('Kyushu University', 
'Kyushu University is one of Japan\'s leading national universities, founded in 1903. Located in Fukuoka, it offers comprehensive programs across all disciplines. The university is known for its research excellence, international programs, and beautiful modern campus facilities.',
'/images/kyushu-logo.png', 'Japan', '/images/japan-flag.png', 4.4),

('Meiji University', 
'Meiji University is a prestigious private university in Tokyo, founded in 1881. Known for its strong programs in law, commerce, and political science, Meiji has produced many influential leaders in business and politics. The university offers modern facilities and diverse international programs.',
'/images/meiji-logo.png', 'Japan', '/images/japan-flag.png', 4.3),

('Nagoya University', 
'Nagoya University is one of Japan\'s leading national universities, founded in 1871. Located in Nagoya, it is renowned for its research excellence and has produced several Nobel Prize winners. The university offers comprehensive programs and maintains strong international partnerships.',
'/images/nagoya-logo.png', 'Japan', '/images/japan-flag.png', 4.5),

('Osaka University', 
'Osaka University is one of Japan\'s top national universities, founded in 1931. Located in Osaka, it is known for its excellence in medicine, engineering, and sciences. The university offers world-class research opportunities and maintains strong industry connections.',
'/images/osaka-logo.png', 'Japan', '/images/japan-flag.png', 4.5),

('Rikkyo University', 
'Rikkyo University is a prestigious private university in Tokyo, founded in 1874. Known for its beautiful campus and strong liberal arts programs, Rikkyo offers excellent education in humanities, social sciences, and business. The university has a strong Christian heritage and international outlook.',
'/images/rikkyo-logo.png', 'Japan', '/images/japan-flag.png', 4.2),

('Rikkyo University College of Law and Politics', 
'Rikkyo University College of Law and Politics offers comprehensive education in legal and political studies. Part of the prestigious Rikkyo University, the college is known for its rigorous academic programs and strong emphasis on critical thinking and social responsibility.',
'/images/rikkyo-law-logo.png', 'Japan', '/images/japan-flag.png', 4.3),

('Sophia University', 
'Sophia University is a prestigious private Catholic university in Tokyo, founded in 1913. Known for its strong international programs and diverse student body, Sophia offers excellent education in liberal arts, sciences, and professional fields. The university has strong global connections and English-taught programs.',
'/images/sophia-logo.png', 'Japan', '/images/japan-flag.png', 4.4),

('Waseda University', 
'Waseda University is one of Japan\'s most prestigious private universities, founded in 1882. Located in Tokyo, it is known for its strong programs in political science, economics, and international relations. Waseda has produced many prime ministers and business leaders, offering excellent international programs.',
'/images/waseda-logo.png', 'Japan', '/images/japan-flag.png', 4.6),

-- PHILIPPINES
('Ateneo de Manila University', 
'Ateneo de Manila University is the Philippines\' premier private research university, founded in 1859. Located in Quezon City, it is known for its excellence in liberal arts, business, and sciences. The university has a strong Jesuit tradition and is renowned for producing influential leaders in Philippine society.',
'/images/ateneo-logo.png', 'Philippines', '/images/philippines-flag.png', 4.3),

-- SOUTH KOREA
('Chung-Ang University', 
'Chung-Ang University is a prestigious private university in Seoul, founded in 1918. Known for its strong programs in business, media, and arts, the university offers modern facilities and innovative academic programs. CAU has strong industry connections and excellent international exchange opportunities.',
'/images/cau-logo.png', 'South Korea', '/images/south-korea-flag.png', 4.2),

('Dongguk University', 
'Dongguk University is a prestigious private university in Seoul, founded in 1906. With Buddhist heritage, the university offers comprehensive programs in humanities, social sciences, and professional fields. Dongguk is known for its beautiful campus and strong cultural programs.',
'/images/dongguk-logo.png', 'South Korea', '/images/south-korea-flag.png', 4.1),

('Ewha Womans University', 
'Ewha Womans University is South Korea\'s premier women\'s university, founded in 1886. Located in Seoul, it is renowned for its academic excellence and beautiful campus. Ewha offers comprehensive programs and has produced many influential women leaders in Korean society.',
'/images/ewha-logo.png', 'South Korea', '/images/south-korea-flag.png', 4.4),

('Hankuk University of Foreign Studies', 
'Hankuk University of Foreign Studies (HUFS) is Korea\'s premier institution for foreign language education, founded in 1954. Located in Seoul, it offers programs in over 45 languages and is known for its excellence in international studies and translation. HUFS has strong global connections.',
'/images/hufs-logo.png', 'South Korea', '/images/south-korea-flag.png', 4.2),

('Inha University', 
'Inha University is a prestigious private university founded in 1954. Located in Incheon, it is known for its engineering, business, and international programs. The university has strong industry partnerships and offers excellent facilities including a modern campus.',
'/images/inha-logo.png', 'South Korea', '/images/south-korea-flag.png', 4.3),

('Korea University', 
'Korea University is one of South Korea\'s most prestigious universities, founded in 1905. Located in Seoul, it is known for its strong programs in law, business, and political science. KU has produced many influential leaders and offers excellent academic and research opportunities.',
'/images/korea-logo.png', 'South Korea', '/images/south-korea-flag.png', 4.5),

('Kyung Hee University', 
'Kyung Hee University is a prestigious private university founded in 1949. Located in Seoul, it is known for its beautiful campus and strong programs in international studies, hospitality, and oriental medicine. The university has a strong global outlook and international partnerships.',
'/images/kyunghee-logo.png', 'South Korea', '/images/south-korea-flag.png', 4.3),

('Pusan National University', 
'Pusan National University is one of South Korea\'s leading national universities, founded in 1946. Located in Busan, it offers comprehensive programs and is known for its research excellence. The university provides beautiful coastal campus environment and strong regional connections.',
'/images/pnu-logo.png', 'South Korea', '/images/south-korea-flag.png', 4.2),

('Seoul National University', 
'Seoul National University is South Korea\'s most prestigious university, founded in 1946. Located in Seoul, it consistently ranks as the top university in Korea and is known for its excellence across all disciplines. SNU has produced many of Korea\'s leaders and offers world-class education.',
'/images/snu-logo.png', 'South Korea', '/images/south-korea-flag.png', 4.8),

('Sogang University', 
'Sogang University is a prestigious private Catholic university in Seoul, founded in 1960. Known for its strong liberal arts programs and small class sizes, Sogang offers excellent education with emphasis on critical thinking and global perspectives. The university has strong industry connections.',
'/images/sogang-logo.png', 'South Korea', '/images/south-korea-flag.png', 4.4),

('Sungkyunkwan University', 
'Sungkyunkwan University is one of Korea\'s oldest universities, founded in 1398. Located in Seoul, it combines traditional Korean values with modern education. SKKU is known for its strong programs in business, engineering, and humanities, with excellent industry partnerships.',
'/images/skku-logo.png', 'South Korea', '/images/south-korea-flag.png', 4.5),

('Yonsei University', 
'Yonsei University is one of South Korea\'s most prestigious universities, founded in 1885. Located in Seoul, it is known for its beautiful campus and excellence in medicine, business, and international studies. Yonsei has strong global connections and offers comprehensive international programs.',
'/images/yonsei-logo.png', 'South Korea', '/images/south-korea-flag.png', 4.6),

-- TAIWAN
('National Chengchi University', 
'National Chengchi University is Taiwan\'s premier institution for political science and international relations, founded in 1927. Located in Taipei, it is known for its strong programs in political science, law, and communications. NCCU has produced many influential leaders in Taiwan\'s government and media.',
'/images/nccu-logo.png', 'Taiwan', '/images/taiwan-flag.png', 4.4),

('National Sun Yat-Sen University', 
'National Sun Yat-Sen University is a prestigious public university founded in 1980. Located in Kaohsiung with beautiful harbor views, it offers comprehensive programs in business, engineering, and social sciences. The university is known for its research excellence and international outlook.',
'/images/nsysu-logo.png', 'Taiwan', '/images/taiwan-flag.png', 4.2),

('National Taiwan Normal University', 
'National Taiwan Normal University is Taiwan\'s premier institution for education and teacher training, founded in 1946. Located in Taipei, it offers comprehensive programs in education, humanities, and sciences. NTNU is known for its strong academic tradition and beautiful campus.',
'/images/ntnu-logo.png', 'Taiwan', '/images/taiwan-flag.png', 4.3),

('National Taiwan University', 
'National Taiwan University is Taiwan\'s most prestigious university, founded in 1928. Located in Taipei, it consistently ranks as the top university in Taiwan and offers excellence across all disciplines. NTU has beautiful campus grounds and strong international partnerships.',
'/images/ntu-logo.png', 'Taiwan', '/images/taiwan-flag.png', 4.6),

('National Taiwan University College of Law', 
'National Taiwan University College of Law is Taiwan\'s premier law school, part of the prestigious National Taiwan University. Established in 1928, it offers comprehensive legal education and has produced many influential legal professionals and judges in Taiwan.',
'/images/ntu-law-logo.png', 'Taiwan', '/images/taiwan-flag.png', 4.5),

('National Taiwan University College of Management', 
'National Taiwan University College of Management is Taiwan\'s top business school, offering world-class business education. Part of the prestigious NTU, the college is known for its rigorous academic programs and strong connections with Taiwan\'s business community.',
'/images/ntu-management-logo.png', 'Taiwan', '/images/taiwan-flag.png', 4.5),

('National Tsing Hua University', 
'National Tsing Hua University is one of Taiwan\'s leading universities, founded in 1911. Located in Hsinchu, it is renowned for its programs in engineering, sciences, and technology. NTHU has strong research capabilities and industry partnerships, particularly in Taiwan\'s tech sector.',
'/images/nthu-logo.png', 'Taiwan', '/images/taiwan-flag.png', 4.4),

-- THAILAND
('Chulalongkorn University', 
'Chulalongkorn University is Thailand\'s most prestigious university, founded in 1917. Located in Bangkok, it is known for its excellence across all disciplines and beautiful campus. CU has produced many of Thailand\'s leaders and offers comprehensive international programs.',
'/images/chula-logo.png', 'Thailand', '/images/thailand-flag.png', 4.5),

('Mahidol University International College', 
'Mahidol University International College offers world-class international education in Thailand. Part of the prestigious Mahidol University, MUIC provides English-taught programs and attracts students from around the world. The college is known for its modern facilities and diverse learning environment.',
'/images/muic-logo.png', 'Thailand', '/images/thailand-flag.png', 4.3),

('Thammasat University', 
'Thammasat University is one of Thailand\'s most prestigious universities, founded in 1934. Located in Bangkok, it is renowned for its programs in law, political science, and social sciences. TU has played a significant role in Thailand\'s democratic development and social progress.',
'/images/thammasat-logo.png', 'Thailand', '/images/thailand-flag.png', 4.4),

-- KAZAKHSTAN
('KIMEP University', 
'KIMEP University is Kazakhstan\'s leading private university, founded in 1992. Located in Almaty, it offers American-style education with programs taught in English. KIMEP is known for its strong business and economics programs and attracts students from across Central Asia.',
'/images/kimep-logo.png', 'Kazakhstan', '/images/kazakhstan-flag.png', 4.1),

-- AUSTRIA
('University of Vienna', 
'The University of Vienna is one of Europe\'s oldest universities, founded in 1365. Located in Austria\'s capital, it offers comprehensive programs across all disciplines in a historic setting. The university combines traditional academic excellence with modern research and has a beautiful campus in the heart of Vienna.',
'/images/univie-logo.png', 'Austria', '/images/austria-flag.png', 4.3),

('Vienna University of Economics and Business', 
'Vienna University of Economics and Business (WU) is Austria\'s premier business university, founded in 1898. Located in Vienna, it offers world-class business and economics education with strong industry connections. WU has a modern campus and excellent international programs.',
'/images/wu-logo.png', 'Austria', '/images/austria-flag.png', 4.4),

-- BELGIUM
('Ghent University', 
'Ghent University is one of Belgium\'s leading universities, founded in 1817. Located in the historic city of Ghent, it offers comprehensive programs across all disciplines. The university is known for its research excellence and beautiful historic campus buildings.',
'/images/ugent-logo.png', 'Belgium', '/images/belgium-flag.png', 4.3),

('Katholieke Universiteit Leuven', 
'KU Leuven is one of Europe\'s oldest and most prestigious universities, founded in 1425. Located in Leuven, it offers comprehensive programs and is known for its research excellence. The university combines historic tradition with modern innovation and has a beautiful campus.',
'/images/kuleuven-logo.png', 'Belgium', '/images/belgium-flag.png', 4.5),

('Solvay Brussels School', 
'Solvay Brussels School is a prestigious business school, part of Université libre de Bruxelles. Founded in 1903, it offers world-class business education in the heart of Europe. The school is known for its international outlook and strong connections with European business.',
'/images/solvay-logo.png', 'Belgium', '/images/belgium-flag.png', 4.2),

('Université Catholique de Louvain', 
'Université Catholique de Louvain is one of Belgium\'s leading French-speaking universities, founded in 1425. Located in Louvain-la-Neuve, it offers comprehensive programs and is known for its research excellence and beautiful modern campus.',
'/images/uclouvain-logo.png', 'Belgium', '/images/belgium-flag.png', 4.3),

('University of Antwerp', 
'The University of Antwerp is a dynamic university founded in 2003, located in Belgium\'s diamond capital. It offers comprehensive programs and is known for its modern approach to education and research. The university has strong industry connections and international partnerships.',
'/images/uantwerp-logo.png', 'Belgium', '/images/belgium-flag.png', 4.2),

-- CZECH REPUBLIC
('Prague University of Economics and Business', 
'Prague University of Economics and Business is the Czech Republic\'s premier business university, founded in 1953. Located in Prague, it offers comprehensive business and economics education with strong industry connections. The university has a modern campus in one of Europe\'s most beautiful cities.',
'/images/vse-logo.png', 'Czech Republic', '/images/czech-flag.png', 4.3),

-- DENMARK
('Aarhus School of Business', 
'Aarhus School of Business is part of Aarhus University, Denmark\'s second-largest university. Located in Aarhus, it offers world-class business education with strong emphasis on sustainability and innovation. The school has excellent facilities and strong industry partnerships.',
'/images/asb-logo.png', 'Denmark', '/images/denmark-flag.png', 4.4),

('Copenhagen Business School', 
'Copenhagen Business School is one of Europe\'s leading business schools, founded in 1917. Located in Copenhagen, it offers world-class business education and is known for its research excellence and strong industry connections. CBS has a modern campus and excellent international programs.',
'/images/cbs-logo.png', 'Denmark', '/images/denmark-flag.png', 4.6),

('IT University of Copenhagen', 
'The IT University of Copenhagen is Denmark\'s leading university for information technology, founded in 1999. Located in Copenhagen, it offers cutting-edge programs in computer science, digital media, and business IT. The university has modern facilities and strong industry connections.',
'/images/itu-logo.png', 'Denmark', '/images/denmark-flag.png', 4.2),

-- FINLAND
('Aalto University School of Business', 
'Aalto University School of Business is Finland\'s premier business school, part of Aalto University. Located in Helsinki, it offers world-class business education with strong emphasis on innovation and design thinking. The school has modern facilities and excellent international programs.',
'/images/aalto-business-logo.png', 'Finland', '/images/finland-flag.png', 4.5),

('Hanken School of Economics', 
'Hanken School of Economics is Finland\'s leading business school, founded in 1909. Located in Helsinki, it offers comprehensive business education in a Nordic context. The school is known for its strong alumni network and excellent career opportunities.',
'/images/hanken-logo.png', 'Finland', '/images/finland-flag.png', 4.4),

-- FRANCE (updating the existing entry)
('EMLYON Business School', 
'EMLYON Business School is one of France\'s leading business schools, founded in 1872. Located in Lyon, it offers world-class business education with strong emphasis on entrepreneurship and innovation. The school has excellent industry connections and modern facilities.',
'/images/emlyon-logo.png', 'France', '/images/france-flag.png', 4.3)
);