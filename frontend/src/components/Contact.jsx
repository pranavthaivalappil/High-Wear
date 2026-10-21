import React from 'react';

function Contact() {
    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xxl)' }}>
            <div className='split-2col'>

                <div>
                    <h1 className="heading-massive" style={{ marginBottom: 'var(--spacing-lg)' }}>CONTACT<br />US</h1>
                    <div className="text-mono" style={{ fontSize: '1.2rem', lineHeight: '1.5', maxWidth: '400px', marginBottom: 'var(--spacing-xl)' }}>
                        <p>CUSTOMER SERVICE, PRESS INQUIRIES, OR WHOLESALE ACCOUNTS.</p>
                        <br />
                        <p>1-800-HIGH-WEAR</p>
                        <p>INFO@HIGHWEAR.COM</p>
                    </div>
                </div>

                <div style={{ border: '2px solid var(--text-main)', padding: 'var(--spacing-lg)' }}>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <label className="text-tiny bracket-wrap">NAME</label>
                            <input type="text" style={{ borderBottom: '2px solid var(--text-main)', padding: 'var(--spacing-sm) 0', fontSize: '1.2rem' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <label className="text-tiny bracket-wrap">EMAIL</label>
                            <input type="email" style={{ borderBottom: '2px solid var(--text-main)', padding: 'var(--spacing-sm) 0', fontSize: '1.2rem' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <label className="text-tiny bracket-wrap">SUBJECT</label>
                            <input type="text" style={{ borderBottom: '2px solid var(--text-main)', padding: 'var(--spacing-sm) 0', fontSize: '1.2rem' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <label className="text-tiny bracket-wrap">MESSAGE</label>
                            <textarea style={{ borderBottom: '2px solid var(--text-main)', padding: 'var(--spacing-sm) 0', fontSize: '1.2rem', background: 'none', border: 'none', borderBottom: '2px solid var(--text-main)', resize: 'vertical', minHeight: '100px', fontFamily: 'var(--font-body)' }}></textarea>
                        </div>
                        <button type="submit" className="hover-invert" style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)', fontSize: '1.5rem', fontWeight: 'bold', border: '2px solid var(--text-main)', alignSelf: 'flex-start', cursor: 'pointer' }}>
                            SEND MESSAGE
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;
