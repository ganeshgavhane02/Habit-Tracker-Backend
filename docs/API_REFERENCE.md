# Habit Tracker Backend - API Reference

**Version**: 1.0 | **Date**: April 3, 2026

---

## 📋 Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Habits](#habits)
- [Analytics](#analytics)
- [Error Responses](#error-responses)

---

## Authentication

### POST `/api/auth/signup`
Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### POST `/api/auth/login`
User login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## Users

### GET `/api/users/profile`
Get current user profile

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-04-01T10:00:00Z"
  }
}
```

---

### PUT `/api/users/profile`
Update user profile

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "jane@example.com",
    "name": "Jane Doe"
  }
}
```

---

## Habits

### POST `/api/habits`
Create a new habit

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Morning Exercise",
  "description": "30 minutes of cardio"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "name": "Morning Exercise",
    "description": "30 minutes of cardio",
    "createdAt": "2026-04-03T10:00:00Z"
  }
}
```

---

### GET `/api/habits`
List all user habits

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Morning Exercise",
      "description": "30 minutes of cardio",
      "createdAt": "2026-04-03T10:00:00Z"
    }
  ]
}
```

---

### GET `/api/habits/:id`
Get specific habit details

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Morning Exercise",
    "description": "30 minutes of cardio",
    "createdAt": "2026-04-03T10:00:00Z"
  }
}
```

---

### PUT `/api/habits/:id`
Update a habit

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Morning Yoga",
  "description": "45 minutes of yoga"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Morning Yoga",
    "description": "45 minutes of yoga"
  }
}
```

---

### DELETE `/api/habits/:id`
Delete a habit

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Habit deleted successfully"
}
```

---

## Analytics

### GET `/api/analytics/dashboard`
Get dashboard analytics data

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalHabits": 6,
    "avgCompletionRate": 85.3,
    "currentStreak": 12,
    "sleepStats": {
      "avgHours": 6.8,
      "totalNights": 25
    },
    "habitStats": [
      {
        "habit": "Morning Exercise",
        "completion_rate": 95
      }
    ],
    "dailyBreakdown": {
      "completed": 4,
      "total": 6,
      "percentage": 67
    },
    "weeklySummary": [
      {
        "day": "Monday",
        "completed": 5,
        "total": 6,
        "percentage": 83
      }
    ],
    "consistencyScore": 85
  }
}
```

---

### GET `/api/analytics/habits/trends?days=30`
Get habit trends

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `days` (optional): Number of days to analyze (default: 90)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "habitId": 1,
        "habitName": "Morning Exercise",
        "weeklyRates": [
          {
            "week": 1,
            "completionRate": 90,
            "completed": 5,
            "total": 6
          }
        ]
      }
    ]
  }
}
```

---

### GET `/api/analytics/sleep?days=30`
Get sleep analytics

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `days` (optional): Number of days to analyze (default: 30)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "stats": {
      "avg_hours": 7.2,
      "total_nights": 20
    },
    "qualityDistribution": [
      { "quality": "good", "count": 15 },
      { "quality": "fair", "count": 5 }
    ],
    "dailySleep": [
      {
        "date": "2026-04-03",
        "duration": 7.5,
        "quality": "good"
      }
    ]
  }
}
```

---

## Error Responses

### 400 Bad Request
Invalid request parameters

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

### 401 Unauthorized
Missing or invalid authentication token

```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

### 403 Forbidden
User doesn't have permission

```json
{
  "success": false,
  "message": "Access denied"
}
```

---

### 404 Not Found
Resource not found

```json
{
  "success": false,
  "message": "Habit not found"
}
```

---

### 500 Internal Server Error
Server error

```json
{
  "success": false,
  "message": "An error occurred. Please try again."
}
```

---

## Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource missing |
| 500 | Server Error - Internal error |

---

## Authentication Headers

All protected endpoints require:
```
Authorization: Bearer {JWT_TOKEN}
```

Get token from login or signup endpoint.

---

**Last Updated**: April 3, 2026  
**API Version**: 1.0  
**Base URL**: http://localhost:3001/api
