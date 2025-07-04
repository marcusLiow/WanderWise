import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function MainCard(){
    const images = [
        'https://www.ntnu.edu/documents/1289651401/1339396683/Hovedbygget.jpg/08dad362-e352-e195-0283-d40706d5bf3b?t=1723102578793',
        'https://www.smu.edu.sg/sites/default/files/inline-images/oss-banner.jpg',
        'https://ifsa-butler.org/wp-content/uploads/2023/09/HERO-Oxford_1231106194.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Kodaki_fuji_frm_shojinko.jpg/960px-Kodaki_fuji_frm_shojinko.jpg' 
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                (prevIndex + 1) % images.length
        );
        }, 3000);
        return () =>  clearInterval(interval);
    }, [images.length]);

    return (
        <Card Card sx={{ 
            maxWidth: 1000,
            height: 500, 
            margin: "25px auto",
            backgroundImage: `url(${images[currentImageIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'}}>
            
            <CardContent sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                color: 'black', 
                height: '100%'}}>
                <Typography variant="h6">
                    Where would you like to go?
                </Typography>
            </CardContent>
        </Card>
    );
}

export default MainCard;