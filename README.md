# ESN Guide 🇸🇰

A web application developed at **University of Žilina (UNIZA)** to help international students discover Slovakia through immersive tours and practical travel information.

---

## Contributors

- Pavel BUTNARU
- Jonathan LE BIGOT
- Louis-Auguste FERRY

---

## Project Overview

ESN Guide is a web application designed for international students participating in exchange programs in Slovakia.

The project provides an interactive platform where students can:

- Discover Slovak cities and landmarks
- Explore cultural and historical places
- Plan immersive tours across Slovakia
- Access useful travel information
- Learn more about Slovak culture

The main objective is to make the integration of international students easier while encouraging them to explore the country.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript
- SQL
- Docker

---

## Project Structure

```text
ESN-Guide/
│
├── frontend/
│   ├── html/
│   ├── css/
│   └── js/
│
├── backend/
│
├── database/
│   └── sql/
│
├── docker/
│
├── docker-compose.yml
└── README.md
```

> The structure may vary depending on your project organization.

---

## Features

- Interactive user interface
- Tourist destinations presentation
- Responsive design
- Database integration
- Docker deployment
- Easy navigation for international students

---

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/esn-guide.git
cd esn-guide
```

---

## Build the Project with Docker

Make sure Docker and Docker Compose are installed.

### Start the application

```bash
docker compose up --build
```

or

```bash
docker-compose up --build
```

---

### Run in background

```bash
docker compose up -d
```

---

### Stop the application

```bash
docker compose down
```

---

## Database

The application uses an SQL database.

If initialization scripts are provided, they are automatically executed when the Docker containers start.

Otherwise, import the SQL file manually.

Example:

```bash
mysql -u root -p database_name < database/init.sql
```

---

## Development

If you modify the source code, rebuild the containers:

```bash
docker compose up --build
```

To remove all containers and volumes:

```bash
docker compose down -v
```

---



## Future Improvements

- Security Mesured enforced 
- Create COmmunity 
- Multi-language support
- Responsive Desgn 

---

## License

This project was developed as part of a university project at **University of Žilina (UNIZA)**.

It is intended for educational purposes.

---

## Acknowledgments

Special thanks to:

- University of Žilina (UNIZA)
- Erasmus Student Network (ESN)
- All students who contributed to the project


