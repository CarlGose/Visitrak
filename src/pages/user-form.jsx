import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './user-form.css';

const destGroups = [
    {
        label: "Offices",
        options: [
            { value: "OFFICE OF STUDENT AFFAIRS", label: "Office of Student Affairs" },
            { value: "PRESIDENT'S OFFICE", label: "President's Office" },
            { value: "ACCOUNTING", label: "Accounting" },
            { value: "REGISTRAR", label: "Registrar" }
        ]
    },
    {
        label: "Basic Education",
        options: [
            { value: "SHARE", label: "SHARE" },
            { value: "Elementary", label: "Elementary" },
            { value: "High School", label: "High School" }
        ]
    },
    {
        label: "College",
        options: [
            { value: "Arts and Sciences (CAS)", label: "Arts & Sciences (CAS)" },
            { value: "College of Business and Accountancy", label: "Business & Accountancy (CBA)" },
            { value: "Criminal Justice Education (CCJE)", label: "Criminal Justice (CCJE)" },
            { value: "Education (CoEd)", label: "Education (CoEd)" },
            { value: "Engineering and Computer Technology (CECT)", label: "Engineering & Tech (CECT)" },
            { value: "Hospitality and Tourism Management (CHTM)", label: "Tourism & Hospitality (CHTM)" },
            { value: "Nursing", label: "Nursing" },
            { value: "Allied Medical Sciences", label: "Allied Medical Sciences" }
        ]
    }
];

const purposeOptions = {
    // Offices
    "OFFICE OF STUDENT AFFAIRS": [
        "Inquiry / Consultation",
        "Submit Documents / Clearance",
        "Student ID Application / Claiming",
        "Disciplinary Action / Meeting"
    ],
    "PRESIDENT'S OFFICE": [
        "Meeting / Appointment",
        "Document Submission",
        "Official Business"
    ],
    "ACCOUNTING": [
        "Tuition / Fee Payment",
        "Refund Claiming",
        "Payment Inquiry / Clearance",
        "Exam Permit Collection"
    ],
    "REGISTRAR": [
        "Request Documents (TOR, Diploma, Certifications)",
        "Claim Documents",
        "Enrollment Inquiry / Registration",
        "Clearance / Evaluation"
    ],

    // Basic Education Group
    "SHARE": [
        "Parent-Teacher Conference (PTC)",
        "Drop-off / Pick-up Student",
        "Inquiry / Enrollment",
        "Visit Faculty / Staff"
    ],
    "Elementary": [
        "Parent-Teacher Conference (PTC)",
        "Drop-off / Pick-up Student",
        "Inquiry / Enrollment",
        "Visit Faculty / Staff"
    ],
    "High School": [
        "Parent-Teacher Conference (PTC)",
        "Drop-off / Pick-up Student",
        "Inquiry / Enrollment",
        "Visit Faculty / Staff"
    ],

    // Colleges
    "Arts and Sciences (CAS)": [
        "Consultation with Dean / Faculty",
        "Claim Documents",
        "Enrollment",
        "Department Clearance"

    ],
    "College of Business and Accountancy": [
        "Consultation with Dean / Faculty",
        "Claim Documents",
        "Enrollment",
        "Department Clearance"

    ],
    "Criminal Justice Education (CCJE)": [
        "Consultation with Dean / Faculty",
        "Claim Documents",
        "Enrollment",
        "Department Clearance"

    ],
    "Education (CoEd)": [
        "Consultation with Dean / Faculty",
        "Claim Documents",
        "Enrollment",
        "Department Clearance"

    ],
    "Engineering and Computer Technology (CECT)": [
        "Consultation with Dean / Faculty",
        "Claim Documents",
        "Enrollment",
        "Department Clearance"

    ],
    "Hospitality and Tourism Management (CHTM)": [
        "Consultation with Dean / Faculty",
        "Claim Documents",
        "Enrollment",
        "Department Clearance"

    ],
    "Nursing": [
        "Consultation with Dean / Faculty",
        "Claim Documents",
        "Enrollment",
        "Department Clearance"

    ],
    "Allied Medical Sciences": [
        "Consultation with Dean / Faculty",
        "Claim Documents",
        "Enrollment",
        "Department Clearance"

    ]
};

const defaultPurposes = [
    "Meeting / Appointment",
    "Inquiry / Consultation",
    "Submit Documents"

];

const validIdOptions = [
    {
        group: "Primary Valid IDs", ids: [
            "Philippine National ID (PhilID / ePhilID)",
            "Philippine Passport",
            "Driver's License (including Student Permits)",
            "UMID Card (Unified Multi-Purpose ID)",
            "SSS ID (Social Security System)",
            "GSIS ID / e-Card (Government Service Insurance System)",
            "PRC ID (Professional Regulation Commission)",
            "Postal ID (PVC Plastic Card)",
            "Voter's ID / Digitized Voter's Certification",
            "School ID (for current students)",
            "Company ID / Government Office ID",
            "OWWA ID (Overseas Workers Welfare Administration)",
            "OFW ID / iDOLE Card",
            "Seaman's Book (Seafarer's Identification and Record Book)",
            "Alien Certificate of Registration (ACR I-Card)",
            "Senior Citizen ID",
            "PWD ID (Person with Disability)",
            "Solo Parent ID",
            "Integrated Bar of the Philippines (IBP) ID",
            "Firearms License (License to Own and Possess Firearms)"
        ]
    },
    {
        group: "Secondary Valid IDs and Documents", ids: [
            "TIN Card (Taxpayer Identification Number)",
            "PhilHealth ID",
            "Pag-IBIG Loyalty Card",
            "NBI Clearance",
            "Police Clearance / ID",
            "Barangay Clearance / Certificate",
            "Barangay ID",
            "Cedula (Community Tax Certificate)",
            "PSA Birth Certificate",
            "PSA Marriage Contract",
            "Transcript of Records (TOR)",
            "School Form 137 / Permanent Record",
            "Alumni ID",
            "Postal ID (Paper-based/Old format)",
            "Pantawid Pamilyang Pilipino Program (4Ps) ID",
            "Government Service Record",
            "City / Municipal / Local Health Card",
            "Credit Card with photo",
            "Bank Account Passbook / ATM Card"
        ]
    }
];

const getLocalISODate = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const UserForm = () => {
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('visitrak_qr_form');
        if (saved) return JSON.parse(saved);
        return {
            name: '',
            address: '',
            destination: '',
            purpose: '',
            valid_id: '',
            date: getLocalISODate()
        };
    });

    const [qrValue, setQrValue] = useState(() => localStorage.getItem('visitrak_qr_value') || '');
    const [isSubmitted, setIsSubmitted] = useState(() => !!localStorage.getItem('visitrak_qr_value'));
    const [isInside, setIsInside] = useState(false);
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600);
    const [isExpired, setIsExpired] = useState(false);

    // Image Capture State
    const [idImageFile, setIdImageFile] = useState(null);
    const [idImagePreview, setIdImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Custom Dropdown State
    const [destOpen, setDestOpen] = useState(false);
    const destRef = useRef(null);
    const [destSearch, setDestSearch] = useState('');
    
    const [purposeOpen, setPurposeOpen] = useState(false);
    const purposeRef = useRef(null);
    const [purposeSearch, setPurposeSearch] = useState('');
    
    const [idOpen, setIdOpen] = useState(false);
    const idRef = useRef(null);
    const [idSearch, setIdSearch] = useState('');

    const [isCustomPurpose, setIsCustomPurpose] = useState(() => {
        const saved = localStorage.getItem('visitrak_qr_form');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.destination && parsed.purpose) {
                const list = purposeOptions[parsed.destination] || defaultPurposes;
                if (list.length > 0 && !list.includes(parsed.purpose)) {
                    return true;
                }
            }
        }
        return false;
    });

    const [customPurposeText, setCustomPurposeText] = useState(() => {
        const saved = localStorage.getItem('visitrak_qr_form');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.destination && parsed.purpose) {
                const list = purposeOptions[parsed.destination] || defaultPurposes;
                if (list.length > 0 && !list.includes(parsed.purpose)) {
                    return parsed.purpose;
                }
            }
        }
        return '';
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (destRef.current && !destRef.current.contains(event.target)) {
                setDestOpen(false);
                setDestSearch('');
            }
            if (purposeRef.current && !purposeRef.current.contains(event.target)) {
                setPurposeOpen(false);
                setPurposeSearch('');
            }
            if (idRef.current && !idRef.current.contains(event.target)) {
                setIdOpen(false);
                setIdSearch('');
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isSubmitted || isInside) return;

        const qrParsed = localStorage.getItem('visitrak_qr_value') ? JSON.parse(localStorage.getItem('visitrak_qr_value')) : null;
        if (!qrParsed || !qrParsed.generatedAt) return;

        const checkExpiration = () => {
            const elapsed = Math.floor((Date.now() - qrParsed.generatedAt) / 1000);
            const remaining = 600 - elapsed;

            if (remaining <= 0) {
                setTimeLeft(0);
                setIsExpired(true);
                return true;
            } else {
                setTimeLeft(remaining);
                return false;
            }
        };

        if (checkExpiration()) return;

        const interval = setInterval(() => {
            if (checkExpiration()) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, [isSubmitted, isInside]);

    const formatTime = (seconds) => {
        if (seconds <= 0) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Hook to check status on load and subscribe to real-time changes
    useEffect(() => {
        if (!isSubmitted || !formData.name) return;

        const checkStatus = async () => {
            const qrParsed = localStorage.getItem('visitrak_qr_value') ? JSON.parse(localStorage.getItem('visitrak_qr_value')) : null;
            if (!qrParsed || !qrParsed.generatedAt) return;
            const generatedTime = qrParsed.generatedAt;

            const { data } = await supabase
                .from('visitor_logs')
                .select('*')
                .eq('name', formData.name)
                .eq('date', formData.date)
                .order('logs_id', { ascending: false })
                .limit(1);

            if (data && data.length > 0) {
                const log = data[0];

                const getLogTime = (dateStr, timeStr) => {
                    try {
                        const d = new Date(dateStr);
                        if (!timeStr) return d.getTime();
                        let hours = 0, minutes = 0;
                        const parts = timeStr.trim().split(' ');
                        if (parts.length === 2) {
                            let [time, mod] = parts;
                            let [h, m] = time.split(':');
                            hours = parseInt(h, 10);
                            minutes = parseInt(m, 10);
                            if (hours === 12) hours = mod.toUpperCase() === 'AM' ? 0 : 12;
                            else if (mod.toUpperCase() === 'PM') hours += 12;
                        } else {
                            let [h, m] = timeStr.split(':');
                            hours = parseInt(h, 10);
                            minutes = parseInt(m, 10);
                        }
                        d.setHours(hours, minutes, 0, 0);
                        return d.getTime();
                    } catch (e) {
                        return 0;
                    }
                };

                const logTime = getLogTime(log.date, log.time_in);
                // If the log was created BEFORE the QR code (minus a 5-minute buffer to account for clock skew/manual entry), it's an OLD log. Ignore it.
                if (logTime && logTime < (generatedTime - 300000)) {
                    return;
                }

                if (log.is_active === false && log.time_out) {
                    handleClear(); // Already scanned out
                } else if (log.is_active === true) {
                    setIsInside(true); // Scanned in, but not out
                }
            }
        };

        checkStatus();

        const channel = supabase
            .channel('qr-status-watch')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'visitor_logs' }, (payload) => {
                const rowObj = payload.new || payload.old || {};

                // If it's a new or updated record for this visitor today
                if (rowObj.name === formData.name) {
                    const qrParsed = localStorage.getItem('visitrak_qr_value') ? JSON.parse(localStorage.getItem('visitrak_qr_value')) : null;
                    if (!qrParsed || !qrParsed.generatedAt) return;
                    
                    const getLogTime = (dateStr, timeStr) => {
                        try {
                            const d = new Date(dateStr);
                            if (!timeStr) return d.getTime();
                            let hours = 0, minutes = 0;
                            const parts = timeStr.trim().split(' ');
                            if (parts.length === 2) {
                                let [time, mod] = parts;
                                let [h, m] = time.split(':');
                                hours = parseInt(h, 10);
                                minutes = parseInt(m, 10);
                                if (hours === 12) hours = mod.toUpperCase() === 'AM' ? 0 : 12;
                                else if (mod.toUpperCase() === 'PM') hours += 12;
                            } else {
                                let [h, m] = timeStr.split(':');
                                hours = parseInt(h, 10);
                                minutes = parseInt(m, 10);
                            }
                            d.setHours(hours, minutes, 0, 0);
                            return d.getTime();
                        } catch (e) {
                            return 0;
                        }
                    };

                    const logTime = getLogTime(rowObj.date, rowObj.time_in);
                    if (logTime && logTime < (qrParsed.generatedAt - 300000)) {
                        return; // Ignore old log events
                    }

                    if (payload.eventType === 'INSERT' && rowObj.is_active === true) {
                        setIsInside(true); // They just timed in!
                    }
                    else if (payload.eventType === 'UPDATE') {
                        if (rowObj.is_active === false && rowObj.time_out) {
                            handleClear(); // Automatically clear when scanned out
                        } else if (rowObj.is_active === true) {
                            setIsInside(true);
                        }
                    }
                }
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [isSubmitted, formData.name, formData.date]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    if (img.width > MAX_WIDTH) {
                        const scaleSize = MAX_WIDTH / img.width;
                        canvas.width = MAX_WIDTH;
                        canvas.height = img.height * scaleSize;
                    } else {
                        canvas.width = img.width;
                        canvas.height = img.height;
                    }
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', 0.7);
                };
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.valid_id) {
            alert('Please select a Valid ID type.');
            return;
        }
        if (!idImageFile) {
            alert('Please take a picture of your Valid ID to leave at the gate.');
            return;
        }
        setIsUploading(true);

        try {
            // Compress Image
            const compressedBlob = await compressImage(idImageFile);
            const fileName = `${Date.now()}_${formData.name.replace(/\s+/g, '_')}.jpg`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('visitor_ids')
                .upload(fileName, compressedBlob, {
                    contentType: 'image/jpeg'
                });

            if (error) {
                console.error("Upload Error:", error);
                alert("Failed to upload ID picture. Please try again.");
                setIsUploading(false);
                return;
            }

            // Generate a signed URL that expires in 1 hour (3600 seconds)
            const { data: urlData, error: urlError } = await supabase.storage.from('visitor_ids').createSignedUrl(fileName, 3600);

            if (urlError) {
                console.error("Signed URL Error:", urlError);
                alert("Failed to generate secure ID link. Please try again.");
                setIsUploading(false);
                return;
            }

            const valid_id_url = urlData.signedUrl;

            // Stringify the form data to be encoded as a QR Code
            const now = Date.now();
            const qrData = JSON.stringify({
                name: formData.name,
                address: formData.address,
                destination: formData.destination,
                purpose: formData.purpose,
                valid_id: formData.valid_id,
                valid_id_url: valid_id_url,
                date: formData.date,
                type: 'visitor',
                generatedAt: now
            });

            localStorage.setItem('visitrak_qr_form', JSON.stringify(formData));
            localStorage.setItem('visitrak_qr_value', qrData);

            setQrValue(qrData);
            setIsSubmitted(true);
        } catch (err) {
            console.error("Submit Error:", err);
            alert("An error occurred. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClear = () => {
        localStorage.removeItem('visitrak_qr_form');
        localStorage.removeItem('visitrak_qr_value');
        localStorage.removeItem('visitrak_qr_expiration');
        setFormData({
            name: '',
            address: '',
            destination: '',
            purpose: '',
            valid_id: '',
            date: getLocalISODate()
        });
        setIsCustomPurpose(false);
        setCustomPurposeText('');
        setQrValue('');
        setIsInside(false);
        setIsSubmitted(false);
        setHasAcceptedTerms(false);
        setIsExpired(false);
    };

    const handleBack = () => {
        handleClear();
    };

    if (!isSubmitted && !hasAcceptedTerms) {
        return (
            <div className="form-page">
                <div className="wup-bg-watermark"></div>
                <div className="form-wrapper">
                    <div className="form-brand">
                        <img src="/wuplogo.png" alt="VisiTrack Logo" />
                        <span>VisiTrack</span>
                    </div>

                    <div className="form-card terms-card">
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <h2 className="form-title">Terms and Conditions</h2>
                            <p className="form-subtitle">Data Privacy Consent</p>
                        </div>
                        <div style={{ fontSize: '0.95rem', color: 'rgba(26, 40, 32, 0.8)', lineHeight: '1.6', marginBottom: '25px', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                            <p style={{ marginBottom: '15px' }}>
                                By proceeding, you agree to the collection and processing of your personal information, including your <strong>Name</strong>, <strong>Address</strong>, and the details from the <strong>Valid ID</strong> you provide.
                            </p>
                            <p style={{ marginBottom: '15px' }}>
                                This information is strictly collected for security, access monitoring, and safety protocols within the campus/premises. Your data will be handled in accordance with the Data Privacy Act of 2012 (R.A. 10173).
                            </p>
                            <p>
                                By clicking "I Agree", you give your consent to these terms.
                            </p>
                        </div>
                        <div className="form-actions terms-actions">
                            <Link to="/" style={{ flex: 1, textDecoration: 'none', display: 'flex' }}>
                                <button type="button" className="btn-submit btn-secondary">
                                    Decline
                                </button>
                            </Link>
                            <button
                                type="button"
                                className="btn-submit"
                                style={{ flex: 1 }}
                                onClick={() => setHasAcceptedTerms(true)}
                            >
                                I Agree
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Form View
    if (!isSubmitted && hasAcceptedTerms) {
        return (
            <div className="form-page">
                <div className="wup-bg-watermark"></div>
                <div className="form-wrapper">
                    <div className="form-brand">
                        <img src="/wuplogo.png" alt="VisiTrack Logo" />
                        <span>VisiTrack</span>
                    </div>

                    <form className="form-card" onSubmit={handleSubmit}>
                        <div className="form-header-text">
                            <h2 className="form-title">Visitor Access Form</h2>
                            <p className="form-subtitle">Fill out the form below to generate your entry pass</p>
                        </div>
                        <div className="form-field">
                            <label htmlFor="name">Full Name <span className="req">*</span></label>
                            <p style={{ fontSize: '12px', margin: '0', color: "red" }}>* The name on your valid ID must match the name entered here.</p>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="e.g. James Smith"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="address">Address <span className="req">*</span></label>
                            <p style={{ fontSize: '12px', margin: '0', color: "red" }}>* The address on your valid ID must match the address entered here.</p>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                placeholder="e.g. Mabini Extension"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field" ref={destRef} style={{ position: 'relative' }}>
                            <label>Destination <span className="req">*</span></label>
                            <div
                                className={`custom-select ${destOpen ? 'open' : ''}`}
                                onClick={() => setDestOpen(!destOpen)}
                            >
                                {formData.destination || <span style={{ color: 'rgba(26, 40, 32, 0.4)' }}>Select a destination...</span>}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>

                            {destOpen && (
                                <div className="custom-options id-dropdown-options">
                                    <div className="id-search-box">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        <input
                                            type="text"
                                            className="id-search-input"
                                            placeholder="Search destination..."
                                            value={destSearch}
                                            onChange={(e) => setDestSearch(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="id-options-scroll">
                                        {destGroups.map((group, idx) => {
                                            const filtered = group.options.filter(opt =>
                                                opt.label.toLowerCase().includes(destSearch.toLowerCase()) || 
                                                opt.value.toLowerCase().includes(destSearch.toLowerCase())
                                            );
                                            if (filtered.length === 0) return null;
                                            return (
                                                <div key={idx}>
                                                    <div className="custom-optgroup">{group.label}</div>
                                                    {filtered.map((opt, i) => (
                                                        <div
                                                            key={i}
                                                            className={`custom-option ${formData.destination === opt.value ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    destination: opt.value,
                                                                    purpose: ''
                                                                }));
                                                                setIsCustomPurpose(false);
                                                                setCustomPurposeText('');
                                                                setDestOpen(false);
                                                                setDestSearch('');
                                                            }}
                                                        >
                                                            {opt.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                        {destGroups.every(g => g.options.filter(opt => opt.label.toLowerCase().includes(destSearch.toLowerCase()) || opt.value.toLowerCase().includes(destSearch.toLowerCase())).length === 0) && (
                                            <div style={{ padding: '12px 16px', color: 'rgba(26,40,32,0.4)', fontSize: '0.9rem', textAlign: 'center' }}>No matching destination found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-field" ref={purposeRef} style={{ position: 'relative' }}>
                            <label>Purpose of Visit <span className="req">*</span></label>
                            <div
                                className={`custom-select ${!formData.destination ? 'disabled' : ''} ${purposeOpen ? 'open' : ''}`}
                                onClick={() => formData.destination && setPurposeOpen(!purposeOpen)}
                            >
                                {isCustomPurpose
                                    ? "Other (Please specify...)"
                                    : (formData.purpose || <span style={{ color: 'rgba(26, 40, 32, 0.4)' }}>
                                        {formData.destination ? "Select a purpose..." : "Select a destination first..."}
                                    </span>)
                                }
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>

                            {purposeOpen && formData.destination && (
                                <div className="custom-options id-dropdown-options">
                                    <div className="id-search-box">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        <input
                                            type="text"
                                            className="id-search-input"
                                            placeholder="Search purpose..."
                                            value={purposeSearch}
                                            onChange={(e) => setPurposeSearch(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="id-options-scroll">
                                        {(purposeOptions[formData.destination] || defaultPurposes)
                                            .filter(opt => opt.toLowerCase().includes(purposeSearch.toLowerCase()))
                                            .map((opt, i) => (
                                            <div
                                                key={i}
                                                className={`custom-option ${(!isCustomPurpose && formData.purpose === opt) ? 'selected' : ''}`}
                                                onClick={() => {
                                                    if (opt === "Other") {
                                                        setIsCustomPurpose(true);
                                                        setFormData(prev => ({ ...prev, purpose: customPurposeText }));
                                                    } else {
                                                        setIsCustomPurpose(false);
                                                        setFormData(prev => ({ ...prev, purpose: opt }));
                                                    }
                                                    setPurposeOpen(false);
                                                    setPurposeSearch('');
                                                }}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                        {(purposeOptions[formData.destination] || defaultPurposes)
                                            .filter(opt => opt.toLowerCase().includes(purposeSearch.toLowerCase())).length === 0 && (
                                            <div style={{ padding: '12px 16px', color: 'rgba(26,40,32,0.4)', fontSize: '0.9rem', textAlign: 'center' }}>No matching purpose found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {isCustomPurpose && formData.destination && (
                            <div className="form-field dynamic-fade-in">
                                <label htmlFor="customPurpose">Specify Purpose <span className="req">*</span></label>
                                <input
                                    type="text"
                                    id="customPurpose"
                                    name="customPurpose"
                                    placeholder="Please specify your purpose..."
                                    value={customPurposeText}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomPurposeText(val);
                                        setFormData(prev => ({ ...prev, purpose: val }));
                                    }}
                                    required
                                />
                            </div>
                        )}

                        {/* Valid ID Searchable Dropdown */}
                        <div className="form-field" ref={idRef} style={{ position: 'relative' }}>
                            <label>Valid ID Presented <span className="req">*</span></label>
                            <div
                                className={`custom-select ${idOpen ? 'open' : ''}`}
                                onClick={() => setIdOpen(!idOpen)}
                            >
                                {formData.valid_id || <span style={{ color: 'rgba(26, 40, 32, 0.4)' }}>Select a valid ID...</span>}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a2820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>

                            {idOpen && (
                                <div className="custom-options id-dropdown-options">
                                    <div className="id-search-box">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        <input
                                            type="text"
                                            className="id-search-input"
                                            placeholder="Search ID type..."
                                            value={idSearch}
                                            onChange={(e) => setIdSearch(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="id-options-scroll">
                                        {validIdOptions.map((group, gIdx) => {
                                            const filtered = group.ids.filter(id =>
                                                id.toLowerCase().includes(idSearch.toLowerCase())
                                            );
                                            if (filtered.length === 0) return null;
                                            return (
                                                <div key={gIdx}>
                                                    <div className="custom-optgroup">{group.group}</div>
                                                    {filtered.map((id, i) => (
                                                        <div
                                                            key={i}
                                                            className={`custom-option ${formData.valid_id === id ? 'selected' : ''}`}
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, valid_id: id }));
                                                                setIdOpen(false);
                                                                setIdSearch('');
                                                            }}
                                                        >
                                                            {id}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                        {validIdOptions.every(g => g.ids.filter(id => id.toLowerCase().includes(idSearch.toLowerCase())).length === 0) && (
                                            <div style={{ padding: '12px 16px', color: 'rgba(26,40,32,0.4)', fontSize: '0.9rem', textAlign: 'center' }}>No matching ID found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ID Picture Capture */}
                        <div className="form-field">
                            <label>Take Picture of ID <span className="req">*</span></label>
                            <p style={{ fontSize: '12px', margin: '0 0 8px 0', color: "rgba(26,40,32,0.6)" }}>Capture your ID to leave at the gate. It will be verified by the guard.</p>
                            <div className="id-capture-container">
                                {idImagePreview ? (
                                    <div className="id-image-preview">
                                        <img src={idImagePreview} alt="ID Preview" />
                                        <button type="button" className="btn-retake" onClick={() => { setIdImageFile(null); setIdImagePreview(null); }}>
                                            Retake Picture
                                        </button>
                                    </div>
                                ) : (
                                    <label className="id-capture-label">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            className="id-capture-input"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setIdImageFile(file);
                                                    setIdImagePreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                        <div className="id-frame-guide"><div className="corners"></div></div>
                                        <div className="id-capture-placeholder">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <path d="M20.4 14.5L16 10 4 20" />
                                            </svg>
                                            <span>Tap to open camera</span>
                                            <span style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '-4px' }}>Please fit your ID within the frame</span>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="form-field date-field">
                            <label>Date of Visit</label>
                            <div className="date-display">
                                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-submit" disabled={isUploading}>
                                {isUploading ? 'Uploading...' : 'Generate Entry Pass'}
                            </button>
                        </div>
                    </form>

                    <p className="back-link-container">
                        <Link to="/" className="back-link">
                            ← Back to Home
                        </Link>
                    </p>
                </div>
            </div>
        );
    }
    // Direct QR / Ticket View
    const displayDate = new Date(formData.date).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    });

    const downloadQR = () => {
        const svg = document.getElementById("QRCode_SVG");
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `VisiTrack_QR_${formData.name.replace(/\s+/g, '_')}.png`;
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
    };

    return (
        <div className="form-page qr-result-page">
            <div className="wup-bg-watermark"></div>
            <header className="gd-header vip-header-centered" style={{ backgroundColor: '#f5f2eb', borderBottom: '1px solid #ddd', width: '100%', position: 'absolute', top: 0, left: 0, padding: '12px 0' }}>
                <img src="/wuplogo.png" alt="VisiTrack Logo" className="gd-header-logo" style={{ margin: '0 auto', display: 'block', width: '44px', height: '44px' }} />
            </header>

            <div className="qr-pass-card">
                <div className="qr-pass-header">
                    <h2>Your QR Code</h2>
                </div>

                <div className="qr-pass-body">
                    {!isInside && (
                        <div className="qr-timer-container" style={{ textAlign: 'center', marginBottom: '15px', color: '#d9534f', fontFamily: 'Outfit' }}>
                            <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px' }}>
                                {isExpired ? 'QR Code Expired' : `Expires in: ${formatTime(timeLeft)}`}
                            </span>
                            <span style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                                {isExpired ? 'Please generate a new pass.' : 'Present to guard before timer ends'}
                            </span>
                        </div>
                    )}
                    {isInside && (
                        <div className="qr-timer-container" style={{ textAlign: 'center', marginBottom: '15px', color: '#28a745', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'Outfit' }}>
                            Currently Timed In
                        </div>
                    )}
                    <div className="qr-code-box" style={{ marginBottom: '15px', position: 'relative' }}>
                        <QRCode
                            id="QRCode_SVG"
                            value={qrValue}
                            size={220}
                            bgColor="#ffffff"
                            fgColor={isExpired ? "#e0e0e0" : "#000000"}
                            level="Q"
                            style={{ opacity: isExpired ? 0.3 : 1 }}
                        />
                        {isExpired && (
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-15deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d9534f', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '4px', textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff', zIndex: 10, border: '6px solid #d9534f', borderRadius: '12px', padding: '10px', background: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }}>
                                EXPIRED
                            </div>
                        )}
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <button onClick={downloadQR} disabled={isExpired} style={{ background: '#f0f0f0', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '8px', cursor: isExpired ? 'not-allowed' : 'pointer', fontFamily: 'Outfit', fontWeight: '600', color: '#333', display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: isExpired ? 0.5 : 1 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Download QR Code
                        </button>
                    </div>

                    <div className="qr-instruction-alert">
                        Present this QR code to the guard to scan<br />for Time in and Time Out
                    </div>

                    <div className="qr-details-list">
                        <div className="qr-detail-row">
                            <span className="qr-detail-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </span>
                            <span className="qr-detail-label">Name:</span>
                            <span className="qr-detail-value">{formData.name}</span>
                        </div>
                        <div className="qr-detail-row">
                            <span className="qr-detail-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </span>
                            <span className="qr-detail-label">Address:</span>
                            <span className="qr-detail-value">{formData.address}</span>
                        </div>
                        <div className="qr-detail-row">
                            <span className="qr-detail-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                            </span>
                            <span className="qr-detail-label">Destination:</span>
                            <span className="qr-detail-value">{formData.destination}</span>
                        </div>
                        <div className="qr-detail-row">
                            <span className="qr-detail-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                            </span>
                            <span className="qr-detail-label">Purpose:</span>
                            <span className="qr-detail-value">{formData.purpose}</span>
                        </div>
                        <div className="qr-detail-row">
                            <span className="qr-detail-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="2" y1="7" x2="22" y2="7"></line><line x1="6" y1="11" x2="10" y2="11"></line></svg>
                            </span>
                            <span className="qr-detail-label">Valid ID:</span>
                            <span className="qr-detail-value">{formData.valid_id}</span>
                        </div>
                        <div className="qr-detail-row">
                            <span className="qr-detail-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </span>
                            <span className="qr-detail-label">Date:</span>
                            <span className="qr-detail-value">{displayDate}</span>
                        </div>
                    </div>

                    <div className="qr-pass-footer">
                        <button
                            onClick={handleBack}
                            className="qr-finish-btn"
                            disabled={isInside && !isExpired}
                            style={isInside && !isExpired ? {
                                opacity: 0.6,
                                cursor: 'not-allowed',
                                background: '#aaa',
                                border: 'none',
                                color: '#fff'
                            } : (isExpired ? { backgroundColor: '#d9534f', color: '#fff' } : {})}
                        >
                            {isExpired ? 'Generate New Pass' : (isInside ? 'Currently Inside (Finish Disabled)' : 'Finish')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
