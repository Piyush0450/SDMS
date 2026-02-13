# Backend Deployment Guide

This guide explains how to deploy the backend of the SDMS application using **Render**.

## Prerequisites

- A GitHub account.
- A [Render](https://render.com) account.
- This project pushed to a GitHub repository.

## Deployment Steps

1.  **Log in to Render** and go to your Dashboard.
2.  Click **New +** and select **Web Service**.
3.  **Connect your GitHub repository**:
    *   Find the repository containing this project.
    *   Click **Connect**.
4.  **Configure the Service**:
    *   **Name**: Choose a name (e.g., `sdms-backend`).
    *   **Root Directory**: `sdms-fullstack/backend` (Important! This points Render to the correct folder).
    *   **Runtime**: Python 3.
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `python -m scripts.reset_db_full && gunicorn "app:create_app()"`
        *   *Note*: This command resets and seeds the database every time the server starts. This is useful for this demo since the filesystem is ephemeral.
5.  **Environment Variables** (Optional but Recommended):
    *   Go to the "Environment" tab (or "Advanced").
    *   Add `SECRET_KEY` with a random strong string.
    *   Add `PYTHON_VERSION` with value `3.10.0` (or your preferred version).
6.  **Deploy**:
    *   Click **Create Web Service**.

## Default Credentials
After deployment, use these credentials to log in:
- **Admin**: `admin` / `01/01/2000`
- **Faculty**: `F_001` / `01/01/1980`
- **Student**: `S_001` / `01/01/2005`

## Important Notes

*   **Database**: This setup currently uses **SQLite**, which stores data in a file (`sdms.sqlite3`).
    *   **Warning**: On Render's free tier (and most serverless platforms), the filesystem is **ephemeral**. This means every time you redeploy or the server restarts, **all data will be wiped**.
    *   **Solution**: For production data persistence, you should switch to using a managed database like **Render PostgreSQL**.
        *   Create a Postgres database on Render.
        *   Update `config.py` or use an environment variable `DATABASE_URL` to point to the Postgres DB.
