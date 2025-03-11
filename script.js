const { useState, useEffect } = React;

function App() {
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');

  // Fetch available times from Google Sheets backend
  useEffect(() => {
    fetch(`https://script.google.com/macros/s/AKfycbwDWLghFbgyGiL1stwyd_W36gY_YrqhFuw4sA3mZxUrTDkOJd8uFmDOmMVP1VnMCkjM/exec?date=${date.toISOString().split('T')[0]}`)
      .then(res => res.json())
      .then(data => setTimeSlots(data.availableTimes || []))
      .catch(err => console.error('Error fetching time slots:', err));
  }, [date]);

  const submitBooking = () => {
    if (!name || !location || !contact || !selectedTime) {
      alert('Please fill in all fields.');
      return;
    }

    const booking = {
      date: date.toISOString().split('T')[0],
      time: selectedTime,
      name,
      location,
      contact
    };

    fetch('https://script.google.com/macros/s/AKfycbwDWLghFbgyGiL1stwyd_W36gY_YrqhFuw4sA3mZxUrTDkOJd8uFmDOmMVP1VnMCkjM/exec', {
      method: 'POST',
      headers: { "Content-Type": "application/json" }, // Ensure correct headers
      body: JSON.stringify(booking),
    })
    .then(res => res.json())
    .then(data => alert('Booking successful!'))
    .catch(err => alert('Error submitting booking.'));
  };

  return (
    <div className="container">
      <h2>Book an Appointment</h2>

      <ReactCalendar onChange={setDate} value={date} />

      <h3>Available Times</h3>
      {timeSlots.length > 0 ? (
        timeSlots.map((time) => (
          <button key={time} onClick={() => setSelectedTime(time)}>
            {time}
          </button>
        ))
      ) : (
        <p>No available slots.</p>
      )}

      <h3>Your Details</h3>
      <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input type="text" placeholder="Contact Info" value={contact} onChange={(e) => setContact(e.target.value)} />

      <button onClick={submitBooking}>Book Now</button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
