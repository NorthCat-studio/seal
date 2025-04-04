
body {
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
}

.container {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: auto;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

input {
  padding: 8px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.seal-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid #333;
  margin: 10px;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
}

.seal-img:active {
  transform: scale(0.95);
}

.shop-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.shop-card {
  background: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;
}

.shop-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.coin-animation {
  position: absolute;
  font-weight: bold;
  animation: floatUp 1s ease-out forwards;
  user-select: none;
  pointer-events: none;
}

@keyframes floatUp {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px);
  }
}
