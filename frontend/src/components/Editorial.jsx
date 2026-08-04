import React from 'react';

function Editorial() {
    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xxl)' }}>
            <h1 className="heading-massive" style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>CAMPAIGN // 01</h1>
            
            <div style={{ columnCount: 3, columnGap: 'var(--spacing-md)' }}>
                <div style={{ breakInside: 'avoid', marginBottom: 'var(--spacing-md)', position: 'relative' }}>
                    <img src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop" alt="Ed 1" />
                    <div className="text-tiny" style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'var(--text-light)', mixBlendMode: 'difference' }}>[ REF : 001 ]</div>
                </div>
                <div style={{ breakInside: 'avoid', marginBottom: 'var(--spacing-md)', position: 'relative' }}>
                    <div style={{ backgroundColor: 'var(--text-main)', color: 'var(--text-light)', padding: 'var(--spacing-xl)', minHeight: '300px', display: 'flex', alignItems: 'center' }}>
                        <h2 className="heading-medium">FUNCTION DICTATES FORM</h2>
                    </div>
                </div>
                <div style={{ breakInside: 'avoid', marginBottom: 'var(--spacing-md)', position: 'relative' }}>
                    <img src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=600&auto=format&fit=crop" alt="Ed 2" />
                </div>
                <div style={{ breakInside: 'avoid', marginBottom: 'var(--spacing-md)', position: 'relative' }}>
                    <img src="https://images.unsplash.com/photo-1509631179647-0c1158f1f7d9?q=80&w=600&auto=format&fit=crop" alt="Ed 3" />
                </div>
                <div style={{ breakInside: 'avoid', marginBottom: 'var(--spacing-md)', position: 'relative' }}>
                    <img src="https://images.unsplash.com/photo-1617391986423-74e897a8fcad?q=80&w=600&auto=format&fit=crop" alt="Ed 4" />
                </div>
                <div style={{ breakInside: 'avoid', marginBottom: 'var(--spacing-md)', position: 'relative' }}>
                    <div style={{ border: '2px solid var(--text-main)', padding: 'var(--spacing-xl)', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <div className="text-mono" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                            MILITARY INFLUENCE.<br/>
                            STREET EXECUTION.<br/>
                            BUILT FOR THE CONCRETE.<br/>
                        </div>
                    </div>
                </div>
                <div style={{ breakInside: 'avoid', marginBottom: 'var(--spacing-md)', position: 'relative' }}>
                    <img src="https://images.unsplash.com/photo-1620808801967-bd1c92d5becc?q=80&w=600&auto=format&fit=crop" alt="Ed 5" />
                </div>
            </div>
        </div>
    );
}

export default Editorial;
