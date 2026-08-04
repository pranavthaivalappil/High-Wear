import React from 'react';

function About() {
    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xxl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-xxl)', alignItems: 'center' }}>
                <div>
                    <h1 className="heading-massive" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', margin: 0 }}>
                        ABOUT US
                    </h1>
                </div>
                <div>
                    <p className="text-mono" style={{ fontSize: '2rem', lineHeight: '1.2', fontWeight: 'bold', marginBottom: 'var(--spacing-lg)' }}>
                        WE ARE NOT A BRAND. WE ARE A UNIFORM.
                    </p>
                    <div className="text-mono" style={{ fontSize: '1.2rem', lineHeight: '1.5', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <p>
                            BORN IN THE STREETS OF TOKYO, REFINED IN LOS ANGELES. OUR GARMENTS ARE CONSTRUCTED WITH MILITARY PRECISION AND DESIGNED FOR THE REALITIES OF MODERN LIFE.
                        </p>
                        <p>
                            WE BELIEVE IN FORM FOLLOWING FUNCTION. NO UNNECESSARY DETAILS. JUST HEAVYWEIGHT FABRICS, CUSTOM HARDWARE, AND A FIT THAT STANDS THE TEST OF TIME.
                        </p>
                        <p>
                            [ ESTABLISHED 2026 ]
                        </p>
                    </div>
                </div>
            </div>
            
            <div style={{ marginTop: 'var(--spacing-xxl)' }}>
                <img src="https://images.unsplash.com/photo-1542314831-c6a4d14fe6a1?q=80&w=1600&auto=format&fit=crop" alt="About Studio" style={{ width: '100%', height: '600px', objectFit: 'cover' }} />
            </div>
        </div>
    );
}

export default About;
