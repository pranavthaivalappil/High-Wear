import React from 'react';

function Footer() {
    return (
        <footer style={{
            marginTop: 'var(--spacing-xxl)',
            borderTop: '2px solid var(--text-main)',
            paddingTop: 'var(--spacing-xl)',
            backgroundColor: 'var(--bg-primary)'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <div style={{ flex: 1 }}>
                    <div className="bracket-box text-tiny" style={{ marginBottom: 'var(--spacing-md)' }}>
                        JOIN OUR COMMUNITY
                    </div>
                </div>

                <div style={{ flex: 2, maxWidth: '600px' }}>
                    <form style={{ display: 'flex', borderBottom: '2px solid var(--text-main)' }}>
                        <input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            style={{
                                width: '100%',
                                padding: 'var(--spacing-sm) 0',
                                fontSize: '1rem',
                                color: 'var(--text-main)'
                            }}
                        />
                        <button type="submit" style={{
                            padding: 'var(--spacing-sm)',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}>
                            →
                        </button>
                    </form>
                    <div className="text-tiny" style={{ marginTop: 'var(--spacing-sm)' }}>
                        [ EXCLUSIVE ACCESS / DROPS / EDITORIALS ]
                    </div>
                </div>

                <div style={{ flex: 1, textAlign: 'right' }}>
                    <div className="text-tiny hover-invert">INSTAGRAM</div>
                    <div className="text-tiny hover-invert">TWITTER</div>
                    <div className="text-tiny hover-invert">YOUTUBE</div>
                </div>
            </div>

            {/* Massive Brand Name spans 100% viewport */}
            <div style={{
                width: '100%',
                overflow: 'hidden',
                lineHeight: 0.8,
                padding: 'var(--spacing-md) 0'
            }}>
                <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '15vw',
                    margin: 0,
                    textAlign: 'center',
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap'
                }}>
                    HIGH WEAR
                </h1>
            </div>
        </footer>
    );
}

export default Footer;
